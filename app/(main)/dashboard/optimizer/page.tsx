'use client';

import { useState } from 'react';
import OptimizerResults from '@/components/optimizer/OptimizerResults';
import OptimizerHistory from '@/components/optimizer/OptimizerHistory';
import UploadLimitBanner from '@/components/optimizer/UploadLimitBanner';

interface AnalysisResult {
  id: string;
  fileName: string;
  uploadDate: Date;
  platform: string;
  overallScore: number;
  hookStrength: number;
  trendAlignment: number;
  pacing: number;
  suggestions: {
    category: string;
    items: string[];
  }[];
  alignedTrends: string[];
  recommendedHashtags: string[];
  bestPostingTimes: string[];
}

export default function OptimizerPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<'tiktok' | 'reels' | 'shorts'>('tiktok');
  const [uploadType, setUploadType] = useState<'video' | 'script'>('video');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [scriptText, setScriptText] = useState('');
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  
  // Mock user plan - in real app, this would come from context/API
  const userPlan = 'basic'; // 'basic' | 'pro' | 'elite'
  const uploadsUsed = 0;
  const uploadLimit = userPlan === 'basic' ? 1 : userPlan === 'pro' ? 10 : Infinity;
  const canUpload = uploadsUsed < uploadLimit;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && canUpload) {
      setUploadedFile(file);
      setCurrentAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if ((!uploadedFile && uploadType === 'video') || (!scriptText && uploadType === 'script')) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        id: Date.now().toString(),
        fileName: uploadedFile?.name || 'Script Analysis',
        uploadDate: new Date(),
        platform: selectedPlatform,
        overallScore: 82,
        hookStrength: 75,
        trendAlignment: 88,
        pacing: 79,
        suggestions: [
          {
            category: 'Hook Optimization',
            items: [
              'Start with a question or bold statement in first 3 seconds',
              'Add text overlay highlighting the main value proposition',
              'Consider using trending audio that matches your content theme'
            ]
          },
          {
            category: 'Trend Alignment',
            items: [
              'Your content aligns with "Glass Skin Routine" trend',
              'Consider incorporating "Micro-HIIT Workouts" angle',
              'Add trending transition effects between segments'
            ]
          },
          {
            category: 'Pacing & Retention',
            items: [
              'Cut 2-3 seconds from intro for faster engagement',
              'Add visual changes every 3-4 seconds to maintain attention',
              'End with a clear CTA or loop back to beginning'
            ]
          }
        ],
        alignedTrends: ['Glass Skin Routine', 'Dopamine Decorating', 'Micro-HIIT Workouts'],
        recommendedHashtags: ['#glassskin', '#skincarerutine', '#morningvibes', '#aestheticlife', '#selfcare2025'],
        bestPostingTimes: ['Weekdays 6-9 AM', 'Tuesday & Thursday 12-2 PM', 'Sunday 7-9 PM']
      };
      
      setCurrentAnalysis(mockResult);
      setHistory(prev => [mockResult, ...prev].slice(0, 10));
      setIsAnalyzing(false);
    }, 3000);
  };

  const platforms = [
    { id: 'tiktok' as const, name: 'TikTok', icon: '◈', color: 'hover:bg-pink-50 dark:hover:bg-pink-900/20' },
    { id: 'reels' as const, name: 'Instagram Reels', icon: '◐', color: 'hover:bg-purple-50 dark:hover:bg-purple-900/20' },
    { id: 'shorts' as const, name: 'YouTube Shorts', icon: '▶', color: 'hover:bg-red-50 dark:hover:bg-red-900/20' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extralight text-foreground font-['Playfair_Display'] italic">
                Content Optimizer
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                Upload your content to get AI-powered optimization suggestions based on trending patterns
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
            {!currentAnalysis ? (
              <div className="max-w-4xl mx-auto">
                {/* Platform selection */}
                <div className="mb-8">
                  <h3 className="text-sm font-light text-muted-foreground mb-4">
                    Select Platform
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {platforms.map(platform => (
                      <button
                        key={platform.id}
                        onClick={() => setSelectedPlatform(platform.id)}
                        className={`p-4 rounded-2xl transition-all ${platform.color}`}
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
                        <div className="text-sm font-light text-secondary-foreground">
                          {platform.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload type toggle */}
                <div className="mb-8">
                  <h3 className="text-sm font-light text-muted-foreground mb-4">
                    Content Type
                  </h3>
                  <div className="flex items-center bg-secondary rounded-full p-1 w-fit">
                    <button
                      onClick={() => setUploadType('video')}
                      className={`px-6 py-2 rounded-full text-sm transition-all ${
                        uploadType === 'video'
                          ? 'bg-card text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      Video Upload
                    </button>
                    <button
                      onClick={() => setUploadType('script')}
                      className={`px-6 py-2 rounded-full text-sm transition-all ${
                        uploadType === 'script'
                          ? 'bg-card text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      Script/Text
                    </button>
                  </div>
                </div>

                {/* Upload area */}
                {uploadType === 'video' ? (
                  <div className="border-2 border-dashed border-border rounded-3xl p-12 text-center">
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/x-msvideo"
                      onChange={handleFileSelect}
                      disabled={!canUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className={`block ${!canUpload ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="text-6xl mb-4 opacity-20">◯</div>
                      {uploadedFile ? (
                        <div>
                          <p className="text-foreground mb-2">
                            {uploadedFile.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setUploadedFile(null);
                            }}
                            className="mt-4 text-sm text-red-600 hover:text-red-700"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-secondary-foreground mb-2">
                            Click to browse for your video
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Supports MP4, MOV, AVI (max 200MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={scriptText}
                      onChange={(e) => setScriptText(e.target.value)}
                      placeholder="Paste your script, caption, or content description here..."
                      className="w-full h-64 p-6 bg-card border border-border rounded-2xl resize-none focus:outline-none focus:ring-2"
                      style={{
                        '--tw-ring-color': 'rgba(var(--accent-rgb), 0.2)'
                      } as React.CSSProperties}
                      disabled={!canUpload}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {scriptText.length} characters
                      </span>
                      {scriptText && (
                        <button
                          onClick={() => setScriptText('')}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Analyze button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={!canUpload || isAnalyzing || (!uploadedFile && uploadType === 'video') || (!scriptText && uploadType === 'script')}
                    className={`px-8 py-3 rounded-full font-light transition-all ${
                      canUpload && ((uploadedFile && uploadType === 'video') || (scriptText && uploadType === 'script'))
                        ? 'hover:scale-105'
                        : 'cursor-not-allowed opacity-50'
                    }`}
                    style={{
                      backgroundColor: canUpload && ((uploadedFile && uploadType === 'video') || (scriptText && uploadType === 'script'))
                        ? 'var(--accent-color)'
                        : 'var(--muted)',
                      color: canUpload && ((uploadedFile && uploadType === 'video') || (scriptText && uploadType === 'script'))
                        ? 'white'
                        : 'var(--muted-foreground)'
                    }}
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⟳</span>
                        Analyzing...
                      </span>
                    ) : (
                      'Analyze Content'
                    )}
                  </button>
                </div>

                {/* Tips */}
                <div className="mt-12 p-6 bg-card rounded-2xl border border-border">
                  <h3 className="text-sm font-medium text-foreground mb-3">
                    Optimization Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span style={{ color: 'var(--accent-color)' }} className="mt-0.5">◉</span>
                      <span>Upload content before publishing to get trend-aligned suggestions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: 'var(--accent-color)' }} className="mt-0.5">◉</span>
                      <span>Best results come from videos under 60 seconds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: 'var(--accent-color)' }} className="mt-0.5">◉</span>
                      <span>Include captions and hashtags for more accurate analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span style={{ color: 'var(--accent-color)' }} className="mt-0.5">◉</span>
                      <span>Check trend alignment to maximize reach potential</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <OptimizerResults
                result={currentAnalysis}
                onBack={() => {
                  setCurrentAnalysis(null);
                  setUploadedFile(null);
                  setScriptText('');
                }}
              />
            )}
          </div>
        </div>

        {/* Sidebar with history */}
        <div className="w-80 border-l border-border bg-card">
          <OptimizerHistory
            history={history}
            onSelect={setCurrentAnalysis}
            currentId={currentAnalysis?.id}
          />
        </div>
      </div>
    </div>
  );
}