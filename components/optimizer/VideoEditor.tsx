'use client';

import { useState, useRef, useEffect } from 'react';

interface EditedVideo {
  id: string;
  name: string;
  duration: number;
  platform: 'tiktok' | 'reels' | 'shorts';
  trendAlignment: string[];
  score: number;
  videoUrl?: string;
  thumbnail?: string;
}

interface VideoEditorProps {
  video: EditedVideo | null;
  isProcessing: boolean;
  onExport: (format: string) => void;
  onRegenerate: () => void;
  onSaveEdit: () => void;
}

export default function VideoEditor({
  video,
  isProcessing,
  onExport,
  onRegenerate,
  onSaveEdit
}: VideoEditorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setCurrentTime(video.currentTime);
      if (progressRef.current) {
        progressRef.current.style.width = `${progress}%`;
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, [video]);

  const togglePlayPause = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isPlaying) {
      videoEl.pause();
    } else {
      videoEl.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    video.currentTime = percentage * video.duration;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  if (isProcessing) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-muted border-t-[var(--accent-color)] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-foreground font-medium mb-2">
              Creating your perfect edit...
            </p>
            <p className="text-xs text-muted-foreground">
              Analyzing trends • Optimizing hooks • Matching audio
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-20">◎</div>
            <p className="text-sm text-muted-foreground">
              Your optimized video will appear here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-foreground">
            Generated Edit
          </h3>
          <div className="flex items-center gap-2">
            {/* Score Badge */}
            <div 
              className="px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1"
              style={{ backgroundColor: getScoreColor(video.score) }}
            >
              <span>Score</span>
              <span className="font-bold">{video.score}</span>
            </div>
            
            {/* Platform Badge */}
            <div className="px-3 py-1 rounded-full bg-secondary text-xs text-foreground">
              {video.platform === 'tiktok' ? 'TikTok' : 
               video.platform === 'reels' ? 'Reels' : 'Shorts'}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSaveEdit}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            title="Save to library"
          >
            <span className="text-lg">💾</span>
          </button>
          
          <button
            onClick={onRegenerate}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            title="Regenerate edit"
          >
            <span className="text-lg">🔄</span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 rounded-full text-sm font-medium text-white transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              Export
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-10">
                <button
                  onClick={() => {
                    onExport('mp4');
                    setShowExportMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors"
                >
                  Export as MP4
                </button>
                <button
                  onClick={() => {
                    onExport('direct');
                    setShowExportMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors"
                >
                  Post directly to {video.platform}
                </button>
                <button
                  onClick={() => {
                    onExport('draft');
                    setShowExportMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors"
                >
                  Save as draft
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4">
        {video.videoUrl ? (
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full h-full object-contain"
            onClick={togglePlayPause}
            poster={video.thumbnail}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl opacity-30">▶</span>
              <p className="text-sm text-muted-foreground mt-2">Preview</p>
            </div>
          </div>
        )}
        
        {/* Play/Pause Overlay */}
        <button
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white text-2xl">
              {isPlaying ? '⏸' : '▶'}
            </span>
          </div>
        </button>
        
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div 
            className="h-1 bg-white/20 rounded-full cursor-pointer overflow-hidden"
            onClick={handleSeek}
          >
            <div
              ref={progressRef}
              className="h-full bg-white transition-all duration-100"
              style={{ width: '0%' }}
            />
          </div>
          
          {/* Time Display */}
          <div className="flex justify-between mt-2 text-white text-xs">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(video.duration)}</span>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="space-y-3">
        {/* Trend Alignment */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Optimized for trends:</p>
          <div className="flex flex-wrap gap-2">
            {video.trendAlignment.map((trend) => (
              <span
                key={trend}
                className="px-3 py-1 rounded-full bg-secondary/50 text-xs text-foreground"
              >
                {trend}
              </span>
            ))}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-sm font-medium text-foreground">{video.duration}s</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Hook strength</p>
            <p className="text-sm font-medium text-foreground">92%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Est. retention</p>
            <p className="text-sm font-medium text-foreground">85%</p>
          </div>
        </div>
      </div>
    </div>
  );
}