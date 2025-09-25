'use client';

interface WatchlistFiltersProps {
  filterStatus: 'all' | 'heating' | 'stable' | 'cooling';
  setFilterStatus: (status: 'all' | 'heating' | 'stable' | 'cooling') => void;
  filterPriority: 'all' | 'high' | 'medium' | 'low';
  setFilterPriority: (priority: 'all' | 'high' | 'medium' | 'low') => void;
  sortBy: 'added' | 'leadTime' | 'score' | 'priority';
  setSortBy: (sort: 'added' | 'leadTime' | 'score' | 'priority') => void;
  categorizedCounts: {
    all: number;
    heating: number;
    stable: number;
    cooling: number;
  };
}

export default function WatchlistFilters({
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  sortBy,
  setSortBy,
  categorizedCounts
}: WatchlistFiltersProps) {
  const statusOptions = [
    { value: 'all' as const, label: 'All', icon: '📋', count: categorizedCounts.all },
    { value: 'heating' as const, label: 'Heating', icon: '🔥', count: categorizedCounts.heating },
    { value: 'stable' as const, label: 'Stable', icon: '📊', count: categorizedCounts.stable },
    { value: 'cooling' as const, label: 'Cooling', icon: '❄️', count: categorizedCounts.cooling }
  ];

  const priorityOptions = [
    { value: 'all' as const, label: 'All Priorities' },
    { value: 'high' as const, label: 'High', color: 'bg-accent/10 text-accent' },
    { value: 'medium' as const, label: 'Medium', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' },
    { value: 'low' as const, label: 'Low', color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' }
  ];

  return (
    <div className="px-8 py-4 border-b border-border bg-card">
      <div className="flex items-center justify-between gap-4">
        {/* Status filter */}
        <div className="flex items-center gap-2">
          {statusOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterStatus === option.value
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-muted-foreground hover:bg-muted'
              }`}
            >
              <span className="mr-1.5">{option.icon}</span>
              {option.label}
              <span className="ml-2 px-1.5 py-0.5 bg-white/20 dark:bg-black/20 rounded-full text-xs">
                {option.count}
              </span>
            </button>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-border"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Sort by */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-border"
          >
            <option value="priority">Sort by Priority</option>
            <option value="added">Recently Added</option>
            <option value="leadTime">Lead Time</option>
            <option value="score">Seer Score</option>
          </select>
        </div>
      </div>
    </div>
  );
}