'use client';

import { useState } from 'react';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { TrendData } from '@/utils/mockTrendsData';

interface WatchlistItem {
  trend: TrendData;
  addedDate: Date;
  notes?: string;
  alertEnabled: boolean;
  priority: 'high' | 'medium' | 'low';
  lastViewed?: Date;
}

interface WatchlistCardProps {
  item: WatchlistItem;
  viewMode: 'cards' | 'grid' | 'compact';
  onClick: () => void;
  status: 'heating' | 'stable' | 'cooling';
}

export default function WatchlistCard({ item, viewMode, onClick, status }: WatchlistCardProps) {
  const { removeFromWatchlist, updateWatchlistItem } = useWatchlist();
  const [showActions, setShowActions] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromWatchlist(item.trend.id);
  };

  const handlePriorityChange = (e: React.MouseEvent, priority: 'high' | 'medium' | 'low') => {
    e.stopPropagation();
    updateWatchlistItem(item.trend.id, { priority });
  };

  const handleAlertToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateWatchlistItem(item.trend.id, { alertEnabled: !item.alertEnabled });
  };

  const daysTracking = Math.floor((Date.now() - item.addedDate.getTime()) / (1000 * 60 * 60 * 24));

  // Refined status indicators
  const statusConfig = {
    heating: {
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block">
          <path d="M7 1L8.5 4.5L12 5L9 8L10 12L7 10L4 12L5 8L2 5L5.5 4.5L7 1Z" 
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Heating'
    },
    stable: {
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block">
          <rect x="2" y="6" width="10" height="2" rx="1" fill="currentColor"/>
        </svg>
      ),
      label: 'Stable'
    },
    cooling: {
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block">
          <path d="M7 1V13M1 7H13M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" 
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      label: 'Cooling'
    }
  };

  const priorityColors = {
    high: 'bg-[var(--accent-color)]',
    medium: 'bg-[var(--accent-color)] opacity-60',
    low: 'bg-[var(--accent-color)] opacity-30'
  };

  // Grid view (compact cards in 3-column grid)
  if (viewMode === 'grid') {
    return (
      <div
        className="bg-card rounded-xl p-5 cursor-pointer border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group hover:border-[var(--accent-color)]/20"
        onClick={onClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="px-2 py-1 rounded-lg text-xs font-medium bg-secondary text-muted-foreground flex items-center gap-1.5">
            {statusConfig[status].icon}
            {statusConfig[status].label}
          </div>
          <div className={`w-1.5 h-1.5 rounded-full ${priorityColors[item.priority]}`} />
        </div>

        {/* Trend name */}
        <div className="mb-3">
          <span className="text-xs px-2 py-0.5 bg-secondary/50 rounded-full">
            {item.trend.category}
          </span>
          <h3 className="text-base font-light text-foreground mt-1.5 line-clamp-2">
            {item.trend.name}
          </h3>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-background rounded-lg">
            <div className="text-lg font-light text-foreground">{item.trend.seerScore}</div>
            <div className="text-[10px] text-muted-foreground">Score</div>
          </div>
          <div className="text-center p-2 bg-background rounded-lg">
            <div className="text-lg font-light text-foreground">{item.trend.leadTime}</div>
            <div className="text-[10px] text-muted-foreground">Days</div>
          </div>
          <div className="text-center p-2 bg-background rounded-lg">
            <div className="text-lg font-light text-foreground">+{item.trend.velocity}%</div>
            <div className="text-[10px] text-muted-foreground">Vel</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">{daysTracking}d tracked</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleAlertToggle}
              className={`p-1.5 rounded transition-all ${
                item.alertEnabled ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]' : 'bg-secondary'
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v1M6 10v1M10 6h1M1 6h1M8.5 8.5l.7.7M2.8 2.8l.7.7M8.5 3.5l.7-.7M2.8 9.2l.7-.7M9 6a3 3 0 11-6 0 3 3 0 016 0z" 
                      stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              onClick={handleRemove}
              className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Compact list view
  if (viewMode === 'compact') {
    return (
      <div
        className="bg-card rounded-xl p-4 cursor-pointer border border-border transition-all duration-300 hover:shadow-lg hover:scale-[1.01] hover:border-[var(--accent-color)]/20"
        onClick={onClick}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className={`w-1 h-12 rounded-full ${priorityColors[item.priority]}`} />

            <div className="px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary text-muted-foreground flex items-center gap-1.5">
              {statusConfig[status].icon}
              {statusConfig[status].label}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-light text-foreground">{item.trend.name}</h3>
                <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">{item.trend.category}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {item.trend.seerScore} score • {item.trend.leadTime} days to peak • +{item.trend.velocity}% velocity
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Tracking for</span>
                <span className="ml-1 font-medium text-secondary-foreground">{daysTracking} days</span>
              </div>
              <button
                onClick={handleAlertToggle}
                className={`p-1.5 rounded-lg transition-all ${
                  item.alertEnabled 
                    ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]' 
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v1M7 12v1M12 7h1M1 7h1M10 10l.7.7M3.3 3.3l.7.7M10 4l.7-.7M3.3 10.7l.7-.7M11 7a4 4 0 11-8 0 4 4 0 018 0z" 
                        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className={`flex items-center gap-2 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={handleRemove}
                className="p-1.5 hover:bg-secondary rounded-lg transition-all text-muted-foreground hover:text-foreground"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cards view (full detail)
  return (
    <div
      className="bg-card rounded-2xl p-6 cursor-pointer border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[var(--accent-color)]/20"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${priorityColors[item.priority]} animate-pulse`} />
          <span className="text-xs text-muted-foreground capitalize">{item.priority} priority</span>
        </div>
        <div className="px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary text-muted-foreground flex items-center gap-1.5">
          {statusConfig[status].icon}
          {statusConfig[status].label}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2 py-0.5 bg-secondary/50 rounded-full">{item.trend.category}</span>
          {item.trend.crossPlatform && (
            <span className="text-xs text-muted-foreground">◈ Cross-platform</span>
          )}
        </div>
        <h3 className="text-lg font-light text-foreground">{item.trend.name}</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 bg-background rounded-lg transition-all hover:bg-secondary">
          <div className="text-xl font-light text-foreground">{item.trend.seerScore}</div>
          <div className="text-xs text-muted-foreground">Score</div>
        </div>
        <div className="text-center p-2 bg-background rounded-lg transition-all hover:bg-secondary">
          <div className="text-xl font-light text-foreground">{item.trend.leadTime}</div>
          <div className="text-xs text-muted-foreground">Days</div>
        </div>
        <div className="text-center p-2 bg-background rounded-lg transition-all hover:bg-secondary">
          <div className="text-xl font-light text-foreground">+{item.trend.velocity}%</div>
          <div className="text-xs text-muted-foreground">Velocity</div>
        </div>
      </div>

      <div className="mb-4">
        <svg width="100%" height="40" preserveAspectRatio="none" viewBox="0 0 100 30">
          <polyline
            points={item.trend.momentum.map((value, index) => 
              `${(index / (item.trend.momentum.length - 1)) * 100},${30 - (value / 100) * 30}`
            ).join(' ')}
            fill="none"
            stroke="var(--accent-color)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <span>Tracking for {daysTracking} days</span>
        <span>Added {new Date(item.addedDate).toLocaleDateString()}</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            {(['high', 'medium', 'low'] as const).map(p => (
              <button
                key={p}
                onClick={(e) => handlePriorityChange(e, p)}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  item.priority === p
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-secondary-foreground'
                }`}
              >
                {p[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAlertToggle}
            className={`p-2 rounded-lg transition-all ${
              item.alertEnabled 
                ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]' 
                : 'bg-secondary text-muted-foreground hover:bg-muted'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v1M7 12v1M12 7h1M1 7h1M10 10l.7.7M3.3 3.3l.7.7M10 4l.7-.7M3.3 10.7l.7-.7M11 7a4 4 0 11-8 0 4 4 0 018 0z" 
                    stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            onClick={handleRemove}
            className="p-2 hover:bg-secondary rounded-lg transition-all text-muted-foreground hover:text-foreground"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {item.notes && (
        <div className="mt-3 p-3 bg-secondary rounded-lg">
          <p className="text-xs text-muted-foreground">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="inline-block mr-1">
              <path d="M6 1v7M6 10v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {item.notes}
          </p>
        </div>
      )}
    </div>
  );
}