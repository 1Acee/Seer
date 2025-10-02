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
    { 
      value: 'all' as const, 
      label: 'All', 
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block">
          <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor"/>
        </svg>
      ),
      count: categorizedCounts.all,
      iconColor: ''
    },
    { 
      value: 'heating' as const, 
      label: 'Heating', 
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block text-orange-500">
          <path d="M7 1L8.5 4.5L12 5L9 8L10 12L7 10L4 12L5 8L2 5L5.5 4.5L7 1Z" 
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      count: categorizedCounts.heating,
      iconColor: 'text-orange-500'
    },
    { 
      value: 'stable' as const, 
      label: 'Stable', 
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block text-blue-500">
          <rect x="2" y="6" width="10" height="2" rx="1" fill="currentColor"/>
        </svg>
      ),
      count: categorizedCounts.stable,
      iconColor: 'text-blue-500'
    },
    { 
      value: 'cooling' as const, 
      label: 'Cooling', 
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block text-cyan-500">
          <path d="M7 1V13M1 7H13M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" 
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      count: categorizedCounts.cooling,
      iconColor: 'text-cyan-500'
    }
  ];

  const priorityOptions = [
    { value: 'all' as const, label: 'All Priorities' },
    { value: 'high' as const, label: 'High Priority' },
    { value: 'medium' as const, label: 'Medium Priority' },
    { value: 'low' as const, label: 'Low Priority' }
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
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-secondary text-muted-foreground hover:bg-muted'
              }`}
            >
              <span className="mr-1.5">{option.icon}</span>
              {option.label}
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                filterStatus === option.value 
                  ? 'bg-background/20' 
                  : 'bg-background/50 dark:bg-foreground/10'
              }`}>
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
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all cursor-pointer"
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
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 transition-all cursor-pointer"
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