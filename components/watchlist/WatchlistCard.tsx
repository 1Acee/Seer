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
  viewMode: 'cards' | 'compact';
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

  // Status colors and indicators
  const statusConfig = {
    heating: {
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-900/20',
      icon: '🔥',
      label: 'Heating Up'
    },
    stable: {
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      icon: '📊',
      label: 'Stable'
    },
    cooling: {
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-100 dark:bg-cyan-900/20',
      icon: '❄️',
      label: 'Cooling'
    }
  };

  const priorityColors = {
    high: 'bg-accent',
    medium: 'bg-yellow-500 dark:bg-yellow-400',
    low: 'bg-green-500 dark:bg-green-400'
  };

  if (viewMode === 'compact') {
    return (
      <div
        className="bg-card rounded-xl p-4 cursor-pointer border border-border transition-all duration-300 hover:border-border hover:shadow-lg hover:scale-[1.01]"
        onClick={onClick}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Priority indicator */}
            <div className={`w-1 h-12 rounded-full ${priorityColors[item.priority]} transition-all duration-300`} />

            {/* Status badge */}
            <div className={`px-2 py-1 rounded-lg text-xs font-medium ${statusConfig[status].bg} ${statusConfig[status].color} transition-all duration-300`}>
              {statusConfig[status].icon} {statusConfig[status].label}
            </div>

            {/* Trend info */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-light text-foreground">
                  {item.trend.name}
                </h3>
                <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">
                  {item.trend.category}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {item.trend.seerScore} score • {item.trend.leadTime} days to peak • +{item.trend.velocity}% velocity
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Tracking for</span>
                <span className="ml-1 font-medium text-secondary-foreground">
                  {daysTracking} days
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAlertToggle}
                  className={`p-1.5 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                    item.alertEnabled 
                      ? 'bg-accent/10 text-accent' 
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {item.alertEnabled ? '🔔' : '🔕'}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className={`flex items-center gap-2 transition-all duration-300 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={handleRemove}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 text-red-600 dark:text-red-400 hover:scale-110"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cards view
  return (
    <div
      className="bg-card rounded-2xl p-6 cursor-pointer border border-border transition-all duration-300 hover:border-border hover:shadow-xl hover:-translate-y-1 animate-fadeIn"
      onClick={onClick}
    >
      {/* Header with priority and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${priorityColors[item.priority]} animate-pulse`} />
          <span className="text-xs text-muted-foreground capitalize">{item.priority} priority</span>
        </div>
        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${statusConfig[status].bg} ${statusConfig[status].color} transition-all duration-300`}>
          {statusConfig[status].icon} {statusConfig[status].label}
        </div>
      </div>

      {/* Trend name and category */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">
            {item.trend.category}
          </span>
          {item.trend.crossPlatform && (
            <span className="text-xs text-muted-foreground">◈ Cross-platform</span>
          )}
        </div>
        <h3 className="text-lg font-light text-foreground">
          {item.trend.name}
        </h3>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 bg-background rounded-lg transition-all duration-300 hover:bg-secondary">
          <div className="text-xl font-light text-foreground">
            {item.trend.seerScore}
          </div>
          <div className="text-xs text-muted-foreground">Score</div>
        </div>
        <div className="text-center p-2 bg-background rounded-lg transition-all duration-300 hover:bg-secondary">
          <div className="text-xl font-light text-foreground">
            {item.trend.leadTime}
          </div>
          <div className="text-xs text-muted-foreground">Days</div>
        </div>
        <div className="text-center p-2 bg-background rounded-lg transition-all duration-300 hover:bg-secondary">
          <div className="text-xl font-light text-foreground">
            +{item.trend.velocity}%
          </div>
          <div className="text-xs text-muted-foreground">Velocity</div>
        </div>
      </div>

      {/* Mini sparkline */}
      <div className="mb-4">
        <svg width="100%" height="40" preserveAspectRatio="none" viewBox="0 0 100 30">
          <polyline
            points={item.trend.momentum.map((value, index) => 
              `${(index / (item.trend.momentum.length - 1)) * 100},${30 - (value / 100) * 30}`
            ).join(' ')}
            fill="none"
            stroke="var(--accent-color)"
            strokeWidth="1.5"
            className="animate-drawLine"
          />
        </svg>
      </div>

      {/* Tracking info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Tracking for {daysTracking} days</span>
        <span>Added {new Date(item.addedDate).toLocaleDateString()}</span>
      </div>

      {/* Actions bar */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          {/* Priority buttons */}
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            {(['high', 'medium', 'low'] as const).map(p => (
              <button
                key={p}
                onClick={(e) => handlePriorityChange(e, p)}
                className={`px-2 py-1 rounded text-xs transition-all duration-200 transform hover:scale-105 ${
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
            className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
              item.alertEnabled 
                ? 'bg-accent/10 text-accent hover:bg-accent/20' 
                : 'bg-secondary text-muted-foreground hover:bg-muted'
            }`}
          >
            {item.alertEnabled ? '🔔' : '🔕'}
          </button>
          <button
            onClick={handleRemove}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 transform hover:scale-110 text-red-600 dark:text-red-400"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Notes section if present */}
      {item.notes && (
        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg animate-slideUp">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            📝 {item.notes}
          </p>
        </div>
      )}
    </div>
  );
}