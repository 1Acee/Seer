'use client';

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

interface OptimizerHistoryProps {
  history: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
  currentId?: string;
}

export default function OptimizerHistory({ history, onSelect, currentId }: OptimizerHistoryProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400';
    return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
  };

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'tiktok': return '◈';
      case 'reels': return '◐';
      case 'shorts': return '▶';
      default: return '◯';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-stone-200 dark:border-stone-800">
        <h3 className="text-lg font-light text-stone-900 dark:text-stone-100">
          Recent Analyses
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          {history.length} uploads this week
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-4xl mb-3 opacity-10">◯</div>
            <p className="text-sm text-stone-500">
              No analyses yet
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className={`w-full text-left p-4 rounded-xl transition-all hover:scale-[1.02] ${
                  currentId === item.id
                    ? 'bg-stone-100 dark:bg-stone-800 border border-accent/20'
                    : 'bg-white dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getPlatformIcon(item.platform)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getScoreColor(item.overallScore)}`}>
                      {item.overallScore}
                    </span>
                  </div>
                  <span className="text-xs text-stone-500">
                    {formatDate(item.uploadDate)}
                  </span>
                </div>
                
                <h4 className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-1 line-clamp-1">
                  {item.fileName}
                </h4>
                
                <div className="flex items-center gap-4 text-xs text-stone-500">
                  <span>Hook: {item.hookStrength}</span>
                  <span>Trend: {item.trendAlignment}</span>
                  <span>Pace: {item.pacing}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tips section */}
      <div className="p-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
        <h4 className="text-xs font-medium text-stone-700 dark:text-stone-300 mb-2">
          Pro Tip
        </h4>
        <p className="text-xs text-stone-600 dark:text-stone-400">
          Analyze your content before posting to maximize engagement. Trends aligned content gets 3x more reach on average.
        </p>
      </div>
    </div>
  );
}