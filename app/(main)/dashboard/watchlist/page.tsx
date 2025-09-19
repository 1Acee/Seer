'use client';

import { useState, useMemo } from 'react';
import { useWatchlist } from '@/contexts/WatchlistContext';
import EmptyWatchlist from '@/components/watchlist/EmptyWatchlist';
import WatchlistStats from '@/components/watchlist/WatchlistStats';
import WatchlistFilters from '@/components/watchlist/WatchlistFilters';
import WatchlistCard from '@/components/watchlist/WatchlistCard';

export default function WatchlistPage() {
  const { watchlist, watchlistCount } = useWatchlist();
  const [filterStatus, setFilterStatus] = useState<'all' | 'heating' | 'stable' | 'cooling'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'added' | 'leadTime' | 'score' | 'priority'>('priority');

  // Categorize trends by status
  const categorizedTrends = useMemo(() => {
    const heating: typeof watchlist = [];
    const stable: typeof watchlist = [];
    const cooling: typeof watchlist = [];

    watchlist.forEach(item => {
      // Determine status based on velocity and recent momentum
      const recentMomentum = item.trend.momentum.slice(-3);
      const avgRecent = recentMomentum.reduce((a, b) => a + b, 0) / recentMomentum.length;
      const avgOverall = item.trend.momentum.reduce((a, b) => a + b, 0) / item.trend.momentum.length;

      if (avgRecent > avgOverall * 1.2) {
        heating.push(item);
      } else if (avgRecent < avgOverall * 0.8) {
        cooling.push(item);
      } else {
        stable.push(item);
      }
    });

    return { heating, stable, cooling };
  }, [watchlist]);

  // Filter and sort watchlist
  const filteredWatchlist = useMemo(() => {
    let filtered = [...watchlist];

    // Status filter
    if (filterStatus !== 'all') {
      filtered = categorizedTrends[filterStatus as keyof typeof categorizedTrends];
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(item => item.priority === filterPriority);
    }

    // Sorting
    switch (sortBy) {
      case 'added':
        filtered.sort((a, b) => b.addedDate.getTime() - a.addedDate.getTime());
        break;
      case 'leadTime':
        filtered.sort((a, b) => a.trend.leadTime - b.trend.leadTime);
        break;
      case 'score':
        filtered.sort((a, b) => b.trend.seerScore - a.trend.seerScore);
        break;
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
    }

    return filtered;
  }, [watchlist, filterStatus, filterPriority, sortBy, categorizedTrends]);

  if (watchlistCount === 0) {
    return <EmptyWatchlist />;
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-light text-stone-900 dark:text-stone-100 mb-6">
            Your Watchlist - Debug Mode (Filters added)
          </h1>
          
          {/* Stats overview */}
          <WatchlistStats 
            watchlist={watchlist}
            categorizedTrends={categorizedTrends}
          />
        </div>
      </div>

      {/* Filters bar */}
      <WatchlistFilters
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categorizedCounts={{
          all: watchlist.length,
          heating: categorizedTrends.heating.length,
          stable: categorizedTrends.stable.length,
          cooling: categorizedTrends.cooling.length
        }}
      />
      
      <div className="p-8">
        <p className="text-stone-600 dark:text-stone-400 mb-8">
          Showing {filteredWatchlist.length} of {watchlistCount} trends
        </p>
        
        <div className="space-y-4">
          {filteredWatchlist.map((item) => (
            <WatchlistCard
              key={item.trend.id}
              item={item}
              viewMode="cards"
              onClick={() => console.log('Clicked:', item.trend.name)}
              status={
                categorizedTrends.heating.includes(item) ? 'heating' :
                categorizedTrends.cooling.includes(item) ? 'cooling' : 'stable'
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
