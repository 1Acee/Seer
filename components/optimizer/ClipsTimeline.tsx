'use client';

import { useState, useRef } from 'react';

interface VideoClip {
  id: string;
  file: File;
  thumbnail?: string;
  duration: number;
  selected: boolean;
  startTime?: number;
  endTime?: number;
}

interface ClipsTimelineProps {
  clips: VideoClip[];
  onClipToggle: (clipId: string) => void;
  onClipDelete: (clipId: string) => void;
  onClipsReorder: (clips: VideoClip[]) => void;
  onAddClips: (files: File[]) => void;
  maxDuration: number;
}

export default function ClipsTimeline({
  clips,
  onClipToggle,
  onClipDelete,
  onClipsReorder,
  onAddClips,
  maxDuration
}: ClipsTimelineProps) {
  const [draggedClip, setDraggedClip] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalDuration = clips
    .filter(c => c.selected)
    .reduce((sum, clip) => sum + clip.duration, 0);

  const handleDragStart = (e: React.DragEvent, clipId: string) => {
    setDraggedClip(clipId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!draggedClip) return;

    const draggedIndex = clips.findIndex(c => c.id === draggedClip);
    if (draggedIndex === dropIndex) return;

    const newClips = [...clips];
    const [draggedItem] = newClips.splice(draggedIndex, 1);
    newClips.splice(dropIndex, 0, draggedItem);
    
    onClipsReorder(newClips);
    setDraggedClip(null);
    setDragOverIndex(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAddClips(files);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Source Clips
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {clips.length} clips • {formatDuration(totalDuration)} total
            {totalDuration > maxDuration && (
              <span className="text-red-500"> (exceeds {maxDuration}s limit)</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-xs rounded-full bg-secondary hover:bg-muted transition-colors"
          >
            + Add Clips
          </button>
          <button
            className="px-3 py-1.5 text-xs rounded-full border border-border hover:bg-secondary transition-colors"
          >
            Auto-arrange
          </button>
        </div>
      </div>

      {/* Timeline */}
      {clips.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-muted-foreground transition-colors"
        >
          <div className="text-3xl mb-2 opacity-20">◯</div>
          <p className="text-sm text-secondary-foreground">
            Drop video clips here or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Seer will automatically create the perfect edit
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Timeline Track */}
          <div className="relative">
            <div className="h-1 bg-secondary rounded-full mb-4">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((totalDuration / maxDuration) * 100, 100)}%`,
                  backgroundColor: totalDuration > maxDuration 
                    ? 'rgb(239, 68, 68)' 
                    : 'var(--accent-color)'
                }}
              />
            </div>
            
            {/* Time markers */}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0s</span>
              <span>{Math.floor(maxDuration / 2)}s</span>
              <span>{maxDuration}s</span>
            </div>
          </div>

          {/* Clips Grid */}
          <div className="grid grid-cols-6 gap-3">
            {clips.map((clip, index) => (
              <div
                key={clip.id}
                draggable
                onDragStart={(e) => handleDragStart(e, clip.id)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className={`relative group cursor-move transition-all ${
                  dragOverIndex === index ? 'scale-105' : ''
                } ${draggedClip === clip.id ? 'opacity-50' : ''}`}
              >
                <div
                  className={`relative rounded-lg border-2 overflow-hidden transition-all ${
                    clip.selected
                      ? 'border-[var(--accent-color)] ring-2 ring-[var(--accent-color)]/20'
                      : 'border-border opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => onClipToggle(clip.id)}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-secondary flex items-center justify-center">
                    {clip.thumbnail ? (
                      <img 
                        src={clip.thumbnail} 
                        alt={clip.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl opacity-30">▶</span>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-white bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-xs truncate font-medium">
                      {clip.file.name.split('.')[0]}
                    </p>
                    <p className="text-xs opacity-80">
                      {Math.floor(clip.duration)}s
                    </p>
                  </div>
                  
                  {/* Selection indicator */}
                  {clip.selected && (
                    <div 
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--accent-color)' }}
                    >
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClipDelete(clip.id);
                    }}
                    className="absolute top-2 left-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <span className="text-xs">×</span>
                  </button>
                </div>
                
                {/* Clip number */}
                <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex gap-2">
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Select all
              </button>
              <span className="text-muted-foreground">•</span>
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Clear selection
              </button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Drag to reorder • Click to select/deselect
            </div>
          </div>
        </div>
      )}
    </div>
  );
}