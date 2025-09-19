'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TrendData } from '@/utils/mockTrendsData';

interface WatchlistItem {
  trend: TrendData;
  addedDate: Date;
  notes?: string;
  alertEnabled: boolean;
  priority: 'high' | 'medium' | 'low';
  lastViewed?: Date;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (trend: TrendData, priority?: 'high' | 'medium' | 'low') => void;
  removeFromWatchlist: (trendId: string) => void;
  isInWatchlist: (trendId: string) => boolean;
  updateWatchlistItem: (trendId: string, updates: Partial<WatchlistItem>) => void;
  getWatchlistItem: (trendId: string) => WatchlistItem | undefined;
  clearWatchlist: () => void;
  watchlistCount: number;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('seer-watchlist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        const restored = parsed.map((item: any) => ({
          ...item,
          addedDate: new Date(item.addedDate),
          lastViewed: item.lastViewed ? new Date(item.lastViewed) : undefined,
          trend: {
            ...item.trend,
            lastUpdated: new Date(item.trend.lastUpdated),
            predictedPeak: new Date(item.trend.predictedPeak)
          }
        }));
        setWatchlist(restored);
      } catch (error) {
        console.error('Failed to load watchlist:', error);
      }
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (watchlist.length > 0) {
      localStorage.setItem('seer-watchlist', JSON.stringify(watchlist));
    } else {
      localStorage.removeItem('seer-watchlist');
    }
  }, [watchlist]);

  const addToWatchlist = (trend: TrendData, priority: 'high' | 'medium' | 'low' = 'medium') => {
    setWatchlist(prev => {
      // Don't add if already in watchlist
      if (prev.some(item => item.trend.id === trend.id)) {
        return prev;
      }
      
      const newItem: WatchlistItem = {
        trend,
        addedDate: new Date(),
        alertEnabled: true,
        priority,
        lastViewed: new Date()
      };
      
      return [...prev, newItem];
    });
  };

  const removeFromWatchlist = (trendId: string) => {
    setWatchlist(prev => prev.filter(item => item.trend.id !== trendId));
  };

  const isInWatchlist = (trendId: string) => {
    return watchlist.some(item => item.trend.id === trendId);
  };

  const updateWatchlistItem = (trendId: string, updates: Partial<WatchlistItem>) => {
    setWatchlist(prev => prev.map(item => 
      item.trend.id === trendId 
        ? { ...item, ...updates }
        : item
    ));
  };

  const getWatchlistItem = (trendId: string) => {
    return watchlist.find(item => item.trend.id === trendId);
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      updateWatchlistItem,
      getWatchlistItem,
      clearWatchlist,
      watchlistCount: watchlist.length
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}