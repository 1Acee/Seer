'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWatchlist } from '@/contexts/WatchlistContext';
import EmptyWatchlist from '@/components/watchlist/EmptyWatchlist';
import WatchlistStats from '@/components/watchlist/WatchlistStats';
import WatchlistFilters from '@/components/watchlist/WatchlistFilters';
import WatchlistCard from '@/components/watchlist/WatchlistCard';
import TrendDetailModal from '@/components/trends/TrendDetailModal';
import { TrendData } from '@/utils/mockTrendsData';

export default function WatchlistPage() {
  const { watchlist, watchlistCount } = useWatchlist();
  const [filterStatus, setFilterStatus] = useState<'all' | 'heating' | 'stable' | 'cooling'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'added' | 'leadTime' | 'score' | 'priority'>('priority');
  const [viewMode, setViewMode] = useState<'cards' | 'grid' | 'compact'>('cards');
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null);

  // Categorize trends by status
  const categorizedTrends = useMemo(() => {
    const heating: typeof watchlist = [];
    const stable: typeof watchlist = [];
    const cooling: typeof watchlist = [];

    watchlist.forEach(item => {
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

    if (filterStatus !== 'all') {
      filtered = categorizedTrends[filterStatus as keyof typeof categorizedTrends];
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(item => item.priority === filterPriority);
    }

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
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/80">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-light text-foreground">
              Your Watchlist
            </h1>
            
            {/* View mode toggle */}
            <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded text-sm transition-all ${
                  viewMode === 'cards'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-secondary-foreground'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block">
                  <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded text-sm transition-all ${
                  viewMode === 'grid'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-secondary-foreground'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block">
                  <rect x="1" y="1" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="6" y="1" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="11" y="1" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="1" y="6" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="6" y="6" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="11" y="6" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="1" y="11" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="6" y="11" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="11" y="11" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`px-3 py-1.5 rounded text-sm transition-all ${
                  viewMode === 'compact'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-secondary-foreground'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block">
                  <rect x="1" y="2" width="14" height="2" rx="0.5" fill="currentColor"/>
                  <rect x="1" y="7" width="14" height="2" rx="0.5" fill="currentColor"/>
                  <rect x="1" y="12" width="14" height="2" rx="0.5" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
          
          <WatchlistStats 
            watchlist={watchlist}
            categorizedTrends={categorizedTrends}
          />
        </div>
      </div>

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
        <p className="text-muted-foreground mb-8">
          Showing {filteredWatchlist.length} of {watchlistCount} trends
        </p>
        
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-4'
        }>
          {filteredWatchlist.map((item) => (
            <WatchlistCard
              key={item.trend.id}
              item={item}
              viewMode={viewMode}
              onClick={() => setSelectedTrend(item.trend)}
              status={
                categorizedTrends.heating.includes(item) ? 'heating' :
                categorizedTrends.cooling.includes(item) ? 'cooling' : 'stable'
              }
            />
          ))}
        </div>
      </div>

      {/* TrendDetailModal - Reusable across all pages */}
      <AnimatePresence>
        {selectedTrend && (
          <TrendDetailModal 
            trend={selectedTrend}
            onClose={() => setSelectedTrend(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}