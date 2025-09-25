'use client';

interface WatchlistStats {
  watchlist: any[];
  categorizedTrends: {
    heating: any[];
    stable: any[];
    cooling: any[];
  };
}

export default function WatchlistStats({ watchlist, categorizedTrends }: WatchlistStats) {
  // Calculate average lead time
  const avgLeadTime = Math.round(
    watchlist.reduce((sum, item) => sum + item.trend.leadTime, 0) / watchlist.length
  );

  // Calculate average score
  const avgScore = Math.round(
    watchlist.reduce((sum, item) => sum + item.trend.seerScore, 0) / watchlist.length
  );

  // Count by priority
  const priorityCounts = watchlist.reduce((acc, item) => {
    acc[item.priority] = (acc[item.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {/* Total trends */}
      <div className="bg-card rounded-xl p-4">
        <div className="text-2xl font-light text-foreground">
          {watchlist.length}
        </div>
        <div className="text-xs text-muted-foreground mt-1">Total Trends</div>
      </div>

      {/* Heating up */}
      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <div className="text-2xl font-light text-orange-600 dark:text-orange-400">
            {categorizedTrends.heating.length}
          </div>
        </div>
        <div className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">Heating Up</div>
      </div>

      {/* Stable */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <div className="text-2xl font-light text-blue-600 dark:text-blue-400">
            {categorizedTrends.stable.length}
          </div>
        </div>
        <div className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">Stable</div>
      </div>

      {/* Cooling */}
      <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">❄️</span>
          <div className="text-2xl font-light text-cyan-600 dark:text-cyan-400">
            {categorizedTrends.cooling.length}
          </div>
        </div>
        <div className="text-xs text-cyan-600/70 dark:text-cyan-400/70 mt-1">Cooling</div>
      </div>

      {/* Average lead time */}
      <div className="bg-card rounded-xl p-4">
        <div className="text-2xl font-light text-foreground">
          {avgLeadTime}d
        </div>
        <div className="text-xs text-muted-foreground mt-1">Avg Lead Time</div>
      </div>

      {/* Average score */}
      <div className="bg-card rounded-xl p-4">
        <div className="text-2xl font-light text-foreground">
          {avgScore}
        </div>
        <div className="text-xs text-muted-foreground mt-1">Avg Score</div>
      </div>
    </div>
  );
}