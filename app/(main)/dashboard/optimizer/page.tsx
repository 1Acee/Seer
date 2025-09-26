'use client';

import { useState, useRef } from 'react';
import UploadLimitBanner from '@/components/optimizer/UploadLimitBanner';
import RecentEdits from '@/components/optimizer/RecentEdits';
import SeerChat from '@/components/optimizer/SeerChat';
import ClipsTimeline from '@/components/optimizer/ClipsTimeline';
import VideoEditor from '@/components/optimizer/VideoEditor';

interface VideoClip {
  id: string;
  file: File;
  thumbnail?: string;
  duration: number;
  selected: boolean;
  startTime?: number;
  endTime?: number;
}

interface EditedVideo {
  id: string;
  name: string;
  duration: number;
  platform: 'tiktok' | 'reels' | 'shorts';
  trendAlignment: string[];
  score: number;
  createdAt: Date;
  videoUrl?: string;
  thumbnail?: string;
}

export default function OptimizerPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<'tiktok' | 'reels' | 'shorts'>('tiktok');
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [currentEdit, setCurrentEdit] = useState<EditedVideo | null>(null);
  const [recentEdits, setRecentEdits] = useState<EditedVideo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock user plan - in real app, this would come from context/API
  const userPlan = 'basic'; // 'basic' | 'pro' | 'elite'
  const uploadsUsed = 0;
  const uploadLimit = userPlan === 'basic' ? 1 : userPlan === 'pro' ? 10 : Infinity;
  const canUpload = uploadsUsed < uploadLimit;

  const platforms = [
    { 
      id: 'tiktok' as const, 
      name: 'TikTok', 
      icon: '◈', 
      maxDuration: 60,
      description: 'Up to 60 seconds'
    },
    { 
      id: 'reels' as const, 
      name: 'Instagram Reels', 
      icon: '◐', 
      maxDuration: 90,
      description: 'Up to 90 seconds'
    },
    { 
      id: 'shorts' as const, 
      name: 'YouTube Shorts', 
      icon: '▶', 
      maxDuration: 60,
      description: 'Up to 60 seconds'
    }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && canUpload) {
      handleAddClips(files);
    }
  };

  const handleAddClips = (files: File[]) => {
    const newClips: VideoClip[] = files.map((file, index) => ({
      id: `clip-${Date.now()}-${index}`,
      file,
      duration: Math.floor(Math.random() * 15) + 5, // Mock duration 5-20s
      selected: true,
      thumbnail: undefined // Would be generated from video frame
    }));
    
    setClips(prev => [...prev, ...newClips]);
  };

  const handleClipToggle = (clipId: string) => {
    setClips(prev => prev.map(clip => 
      clip.id === clipId ? { ...clip, selected: !clip.selected } : clip
    ));
  };

  const handleClipDelete = (clipId: string) => {
    setClips(prev => prev.filter(clip => clip.id !== clipId));
  };

  const handleClipsReorder = (reorderedClips: VideoClip[]) => {
    setClips(reorderedClips);
  };

  const handleGenerateEdit = async () => {
    if (clips.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockEdit: EditedVideo = {
        id: `edit-${Date.now()}`,
        name: `${selectedPlatform}-edit-${Date.now()}`,
        duration: platforms.find(p => p.id === selectedPlatform)?.maxDuration || 60,
        platform: selectedPlatform,
        trendAlignment: ['Glass Skin Routine', 'Morning Reset', 'Aesthetic Life'],
        score: Math.floor(Math.random() * 20) + 75, // 75-95 score
        createdAt: new Date(),
        videoUrl: undefined, // Would be actual video URL
        thumbnail: undefined
      };
      
      setCurrentEdit(mockEdit);
      setRecentEdits(prev => [mockEdit, ...prev].slice(0, 10));
      setIsProcessing(false);
    }, 3000);
  };

  const handleEditRequest = (request: string) => {
    // Handle AI chat edit requests
    console.log('Edit request:', request);
    // Would trigger re-processing with specific instructions
  };

  const handleExport = (format: string) => {
    console.log('Exporting as:', format);
    // Handle export logic
  };

  const handleRegenerate = () => {
    handleGenerateEdit();
  };

  const handleSaveEdit = () => {
    console.log('Saving edit');
    // Handle save logic
  };

  const handleSelectRecentEdit = (edit: EditedVideo) => {
    setCurrentEdit(edit);
  };

  const selectedClipsCount = clips.filter(c => c.selected).length;
  const chatContext = {
    platform: selectedPlatform,
    duration: platforms.find(p => p.id === selectedPlatform)?.maxDuration || 60,
    hasEdit: currentEdit !== null,
    trendAlignment: currentEdit?.trendAlignment,
    score: currentEdit?.score
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extralight text-foreground font-['Playfair_Display'] italic">
                AI Video Optimizer
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                Upload raw clips and let Seer AI create the perfect viral video - intelligently edited, trend-aligned, and optimized for your chosen platform
              </p>
            </div>
            
            {/* Upload limit indicator */}
            <UploadLimitBanner 
              used={uploadsUsed}
              limit={uploadLimit}
              plan={userPlan}
            />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main content area */}
        <div className="flex-1">
          <div className="p-8">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Platform selection */}
              <div>
                <h3 className="text-sm font-light text-muted-foreground mb-4">
                  Select Platform
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {platforms.map(platform => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className="p-4 rounded-2xl transition-all hover:scale-[1.02]"
                      style={{
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor: selectedPlatform === platform.id 
                          ? 'var(--accent-color)' 
                          : 'var(--border)',
                        backgroundColor: selectedPlatform === platform.id 
                          ? 'rgba(var(--accent-rgb), 0.05)' 
                          : 'transparent'
                      }}
                    >
                      <div className="text-2xl mb-2">{platform.icon}</div>
                      <div className="text-sm font-light text-foreground">
                        {platform.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {platform.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clips Timeline */}
              <ClipsTimeline
                clips={clips}
                onClipToggle={handleClipToggle}
                onClipDelete={handleClipDelete}
                onClipsReorder={handleClipsReorder}
                onAddClips={handleAddClips}
                maxDuration={platforms.find(p => p.id === selectedPlatform)?.maxDuration || 60}
              />

              {/* Generate Button */}
              {clips.length > 0 && !currentEdit && (
                <div className="flex justify-center">
                  <button
                    onClick={handleGenerateEdit}
                    disabled={!canUpload || isProcessing || selectedClipsCount === 0}
                    className={`px-8 py-3 rounded-full font-light transition-all text-white ${
                      canUpload && selectedClipsCount > 0
                        ? 'hover:scale-105'
                        : 'cursor-not-allowed opacity-50'
                    }`}
                    style={{
                      backgroundColor: canUpload && selectedClipsCount > 0
                        ? 'var(--accent-color)'
                        : 'var(--muted)'
                    }}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⟳</span>
                        Creating your perfect edit...
                      </span>
                    ) : (
                      `Generate Optimized Video (${selectedClipsCount} clips)`
                    )}
                  </button>
                </div>
              )}

              {/* Video Editor */}
              <VideoEditor
                video={currentEdit}
                isProcessing={isProcessing}
                onExport={handleExport}
                onRegenerate={handleRegenerate}
                onSaveEdit={handleSaveEdit}
              />

              {/* Tips */}
              {clips.length === 0 && !currentEdit && (
                <div className="mt-12 p-6 bg-card rounded-2xl border border-border">
                  <h3 className="text-sm font-medium text-foreground mb-3">
                    How it Works
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span style={{ color: 'var(--accent-color)' }} className="mt-0.5">◉</span>
                      <span>Upload multiple raw clips - Seer AI will intelligently combine them</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: 'var(--accent-color)' }} className="mt-0.5">◉</span>
                      <span>AI automatically edits for maximum engagement based on current trends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: 'var(--accent-color)' }} className="mt-0.5">◉</span>
                      <span>Use the chat to refine your edit with natural language instructions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: 'var(--accent-color)' }} className="mt-0.5">◉</span>
                      <span>Export directly to your platform or download the optimized video</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[400px] border-l border-border bg-card flex flex-col">
          {/* Recent Edits - Top Section */}
          <div className="p-6 border-b border-border">
            <RecentEdits
              edits={recentEdits}
              onSelect={handleSelectRecentEdit}
              currentId={currentEdit?.id}
            />
          </div>
          
          {/* AI Chat - Bottom Section */}
          <div className="flex-1 p-6 overflow-hidden">
            <SeerChat
              context={chatContext}
              onEditRequest={handleEditRequest}
            />
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}