// components/trends/TrendDetailModal.tsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendData } from '@/utils/mockTrendsData';

interface TrendDetailModalProps {
  trend: TrendData;
  onClose: () => void;
}

export default function TrendDetailModal({ trend, onClose }: TrendDetailModalProps) {
  const [chartTimeframe, setChartTimeframe] = useState('14d');
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Generate extended chart data
  const generateChartData = () => {
    const days = chartTimeframe === '7d' ? 7 : chartTimeframe === '14d' ? 14 : 30;
    const historicalData = Array.from({ length: days }, (_, i) => ({
      day: i - days + 1,
      value: trend.momentum[Math.floor(i * trend.momentum.length / days)] || Math.random() * 50 + 20,
      type: 'historical'
    }));

    const predictedData = Array.from({ length: trend.leadTime }, (_, i) => ({
      day: i + 1,
      value: Math.min(100, trend.momentum[trend.momentum.length - 1] * (1 + (trend.velocity / 100) * ((i + 1) / trend.leadTime))),
      type: 'predicted'
    }));

    return [...historicalData, ...predictedData];
  };

  const chartData = generateChartData();
  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-6xl max-h-[90vh] bg-card rounded-3xl shadow-2xl overflow-hidden border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                  {trend.category}
                </span>
                {trend.crossPlatform && (
                  <span className="text-sm text-muted-foreground">◈ Cross-platform</span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  trend.saturation === 'Low' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                  trend.saturation === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  {trend.saturation} Saturation
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  trend.novelty === 'High' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                  trend.novelty === 'Medium' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                  'bg-secondary text-muted-foreground'
                }`}>
                  {trend.novelty} Novelty
                </span>
              </div>
              <h2 className="text-3xl font-light text-foreground font-['Playfair_Display'] italic">
                {trend.name}
              </h2>
              <p className="text-muted-foreground mt-2">
                {trend.description}
              </p>
            </div>
            <div className="flex items-center gap-3 ml-6">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-5 py-2 rounded-full transition-all ${
                  isFollowing 
                    ? 'bg-[var(--accent-color)] text-white hover:opacity-80' 
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-muted-foreground">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 px-8 py-4 border-b border-border">
          {['overview', 'evidence', 'actions', 'ai-insights'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-2 text-sm transition-colors ${
                activeTab === tab 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-secondary-foreground'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'evidence' && 'Evidence'}
              {tab === 'actions' && 'Actions'}
              {tab === 'ai-insights' && 'AI Insights'}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[var(--accent-color)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 240px)' }}>
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-6">
                <div className="p-6 bg-background rounded-2xl border border-border transition-all hover:border-[var(--accent-color)]/20">
                  <div className="text-3xl font-extralight text-foreground mb-1">
                    {trend.seerScore}
                  </div>
                  <div className="text-sm text-muted-foreground">Seer Score</div>
                </div>
                <div className="p-6 bg-background rounded-2xl border border-border transition-all hover:border-[var(--accent-color)]/20">
                  <div className="text-3xl font-extralight text-foreground mb-1">
                    {trend.leadTime}
                  </div>
                  <div className="text-sm text-muted-foreground">Days to Peak</div>
                </div>
                <div className="p-6 bg-background rounded-2xl border border-border transition-all hover:border-[var(--accent-color)]/20">
                  <div className="text-3xl font-extralight text-[var(--accent-color)] mb-1">
                    +{trend.velocity}%
                  </div>
                  <div className="text-sm text-muted-foreground">Velocity</div>
                </div>
                <div className="p-6 bg-background rounded-2xl border border-border transition-all hover:border-[var(--accent-color)]/20">
                  <div className="text-3xl font-extralight text-foreground mb-1">
                    {trend.confidence}%
                  </div>
                  <div className="text-sm text-muted-foreground">Confidence</div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-background rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-light text-foreground">
                    Momentum & Prediction
                  </h3>
                  <div className="flex items-center gap-2">
                    {['7d', '14d', '30d'].map(tf => (
                      <button
                        key={tf}
                        onClick={() => setChartTimeframe(tf)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          chartTimeframe === tf
                            ? 'bg-foreground text-background'
                            : 'bg-card text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Chart */}
                <div className="relative">
                  <svg width="100%" height="300" className="overflow-visible">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(percent => (
                      <line
                        key={percent}
                        x1="0"
                        y1={300 - (percent / 100) * 300}
                        x2="100%"
                        y2={300 - (percent / 100) * 300}
                        stroke="currentColor"
                        strokeOpacity="0.1"
                        className="text-muted-foreground"
                      />
                    ))}

                    {/* Data lines */}
                    <g>
                      {/* Historical line */}
                      <polyline
                        points={chartData
                          .filter(d => d.type === 'historical')
                          .map((d, i) => 
                            `${(i / (chartData.filter(d => d.type === 'historical').length - 1)) * 50}%,${300 - ((d.value - minValue) / (maxValue - minValue)) * 280}`
                          ).join(' ')}
                        fill="none"
                        stroke="#a8a29e"
                        strokeWidth="2"
                      />

                      {/* Predicted line */}
                      <polyline
                        points={chartData
                          .filter(d => d.type === 'predicted')
                          .map((d, i) => 
                            `${50 + (i / (chartData.filter(d => d.type === 'predicted').length - 1)) * 50}%,${300 - ((d.value - minValue) / (maxValue - minValue)) * 280}`
                          ).join(' ')}
                        fill="none"
                        stroke="var(--accent-color)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    </g>

                    {/* Peak indicator */}
                    <circle
                      cx="100%"
                      cy={`${300 - ((chartData[chartData.length - 1].value - minValue) / (maxValue - minValue)) * 280}`}
                      r="6"
                      fill="var(--accent-color)"
                      className="animate-pulse"
                    />
                  </svg>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-muted-foreground"></div>
                      <span className="text-xs text-muted-foreground">Historical</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-[var(--accent-color)]" style={{ borderTop: '2px dashed var(--accent-color)', height: 0 }}></div>
                      <span className="text-xs text-muted-foreground">Predicted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--accent-color)] rounded-full animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">Peak (~{trend.leadTime} days)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <h3 className="text-lg font-light text-foreground mb-4">
                  Trending Hashtags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trend.hashtags.map(tag => (
                    <button
                      key={tag}
                      className="px-4 py-2 bg-secondary rounded-full text-sm text-secondary-foreground hover:bg-muted transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-6">
              <h3 className="text-lg font-light text-foreground mb-4">
                Evidence Sources
              </h3>
              {Object.entries(trend.evidence).map(([platform, count]) => (
                <div key={platform} className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border transition-all hover:border-[var(--accent-color)]/20">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl text-muted-foreground">
                      {platform === 'reddit' ? '◉' : 
                       platform === 'tiktok' ? '◈' :
                       platform === 'youtube' ? '▶' :
                       platform === 'twitter' ? '◎' : '◐'}
                    </div>
                    <div>
                      <div className="text-foreground capitalize font-light">{platform}</div>
                      <div className="text-sm text-muted-foreground">{count} mentions</div>
                    </div>
                  </div>
                  <button className="text-sm text-[var(--accent-color)] hover:underline">
                    View sources →
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-background rounded-2xl border border-border">
                  <h4 className="text-lg font-light text-foreground mb-4">
                    Content Ideas
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--accent-color)] mt-0.5">◉</span>
                      <span>Tutorial showcasing the trend</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--accent-color)] mt-0.5">◉</span>
                      <span>"Day in the life" featuring this trend</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--accent-color)] mt-0.5">◉</span>
                      <span>Comparison with similar trends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--accent-color)] mt-0.5">◉</span>
                      <span>Behind-the-scenes creation process</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-background rounded-2xl border border-border">
                  <h4 className="text-lg font-light text-foreground mb-4">
                    Best Times to Post
                  </h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--accent-color)] mt-0.5">◉</span>
                      <div>
                        <div className="font-medium text-foreground">Weekdays</div>
                        <div>6-9 AM, 12-2 PM</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--accent-color)] mt-0.5">◉</span>
                      <div>
                        <div className="font-medium text-foreground">Weekends</div>
                        <div>11 AM - 1 PM</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--accent-color)] mt-0.5">◉</span>
                      <div>
                        <div className="font-medium text-foreground">Peak days</div>
                        <div>Tuesday & Thursday</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-insights' && (
            <div className="p-12 bg-background rounded-2xl border border-border">
              <div className="text-center">
                <div className="text-6xl mb-6 opacity-10">◎</div>
                <h3 className="text-xl font-light text-foreground mb-2">
                  AI Chat Coming Soon
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Ask questions about this trend and get personalized insights powered by AI
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}