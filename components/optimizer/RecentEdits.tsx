'use client';

interface EditedVideo {
  id: string;
  name: string;
  duration: number;
  platform: 'tiktok' | 'reels' | 'shorts';
  trendAlignment: string[];
  score: number;
  createdAt: Date;
  thumbnail?: string;
}

interface RecentEditsProps {
  edits: EditedVideo[];
  onSelect: (edit: EditedVideo) => void;
  currentId?: string;
}

export default function RecentEdits({ edits, onSelect, currentId }: RecentEditsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
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
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground">
          Recent Edits
        </h3>
        <span className="text-xs text-muted-foreground">
          {edits.length} this week
        </span>
      </div>

      {edits.length === 0 ? (
        <div className="text-center py-4">
          <div className="text-2xl mb-2 opacity-20">◯</div>
          <p className="text-xs text-muted-foreground">
            No edits yet - upload clips to get started
          </p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto max-h-48">
          {edits.map((edit) => (
            <button
              key={edit.id}
              onClick={() => onSelect(edit)}
              className={`w-full text-left p-3 rounded-xl transition-all hover:scale-[1.01] ${
                currentId === edit.id
                  ? 'bg-secondary border-l-2'
                  : 'bg-secondary/50 hover:bg-secondary'
              }`}
              style={{
                borderLeftColor: currentId === edit.id ? 'var(--accent-color)' : 'transparent'
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg opacity-60">{getPlatformIcon(edit.platform)}</span>
                  <span className={`text-sm font-medium ${getScoreColor(edit.score)}`}>
                    {edit.score}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(edit.createdAt)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">
                  {edit.duration}s edit
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {edit.trendAlignment[0]}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}