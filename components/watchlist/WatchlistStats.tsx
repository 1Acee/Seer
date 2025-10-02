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
      <div className="bg-card rounded-xl p-4">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" className="text-orange-500">
            <path d="M7 1L8.5 4.5L12 5L9 8L10 12L7 10L4 12L5 8L2 5L5.5 4.5L7 1Z" 
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="text-2xl font-light text-foreground">
            {categorizedTrends.heating.length}
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Heating Up</div>
      </div>

      {/* Stable */}
      <div className="bg-card rounded-xl p-4">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" className="text-blue-500">
            <rect x="2" y="6" width="10" height="2" rx="1" fill="currentColor"/>
          </svg>
          <div className="text-2xl font-light text-foreground">
            {categorizedTrends.stable.length}
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Stable</div>
      </div>

      {/* Cooling */}
      <div className="bg-card rounded-xl p-4">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" className="text-cyan-500">
            <path d="M7 1V13M1 7H13M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" 
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div className="text-2xl font-light text-foreground">
            {categorizedTrends.cooling.length}
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Cooling</div>
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