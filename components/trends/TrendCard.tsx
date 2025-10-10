'use client';

import { useState } from 'react';
import { TrendData } from '@/utils/mockTrendsData';
import { useWatchlist } from '@/contexts/WatchlistContext';

interface TrendCardProps {
  trend: TrendData;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

export default function TrendCard({ trend, viewMode, onClick }: TrendCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const isFollowing = isInWatchlist(trend.id);

  // Calculate sparkline path
  const sparklinePath = () => {
    const width = viewMode === 'grid' ? 100 : 120;
    const height = 30;
    const points = trend.momentum.map((value, index) => ({
      x: (index / (trend.momentum.length - 1)) * width,
      y: height - (value / 100) * height
    }));

    const path = points.reduce((acc, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');

    return path;
  };

  // Calculate total evidence count
  const totalEvidence = Object.values(trend.evidence).reduce((sum, count) => sum + count, 0);

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFollowing) {
      removeFromWatchlist(trend.id);
    } else {
      addToWatchlist(trend);
    }
  };

  if (viewMode === 'list') {
    return (
      <div
        className="bg-card rounded-2xl p-6 cursor-pointer border border-border hover:border-border transition-all hover:scale-[1.01] hover:shadow-lg"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-6">
            {/* Seer Score */}
            <div className="flex flex-col items-center">
              <div className="text-2xl font-light text-foreground">
                {trend.seerScore}
              </div>
              <div className="text-xs text-muted-foreground">score</div>
            </div>

            {/* Trend info */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-light text-foreground">
                  {trend.name}
                </h3>
                <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs">
                  {trend.category}
                </span>
                {trend.crossPlatform && (
                  <span className="text-xs text-muted-foreground">◈ Cross-platform</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {trend.description}
              </p>
            </div>
          </div>

          {/* Middle section - sparkline */}
          <div className="px-8">
            <svg width="120" height="30" className="overflow-visible">
              <path
                d={sparklinePath()}
                fill="none"
                stroke={isHovered ? 'var(--accent-color)' : '#a8a29e'}
                strokeWidth="1.5"
                className="transition-colors"
              />
            </svg>
            <div className="text-xs text-muted-foreground text-center mt-1">14d momentum</div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-6">
            {/* Lead time */}
            <div className="text-center">
              <div className="text-lg font-light text-foreground">
                {trend.leadTime}
              </div>
              <div className="text-xs text-muted-foreground">days to peak</div>
            </div>

            {/* Velocity */}
            <div className="text-center">
              <div className="text-lg font-light text-foreground">
                +{trend.velocity}%
              </div>
              <div className="text-xs text-muted-foreground">velocity</div>
            </div>

            {/* Status pills */}
            <div className="flex flex-col gap-1">
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                trend.saturation === 'Low' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                trend.saturation === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}>
                {trend.saturation} Saturation
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                trend.novelty === 'High' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                trend.novelty === 'Medium' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                'bg-secondary text-muted-foreground'
              }`}>
                {trend.novelty} Novelty
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleFollowClick}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <span className={isFollowing ? 'text-[var(--accent-color)]' : 'text-muted-foreground'}>
                  {isFollowing ? '◉' : '◯'}
                </span>
              </button>
              <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                <span className="text-muted-foreground">⤴</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      className="bg-card rounded-3xl p-6 cursor-pointer border border-border hover:border-border transition-all h-full hover:scale-[1.02] hover:-translate-y-2 hover:shadow-xl overflow-hidden"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
              {trend.category}
            </span>
            {trend.crossPlatform && (
              <span className="text-xs text-muted-foreground">◈</span>
            )}
          </div>
          <h3 className="text-lg font-light text-foreground mb-1 break-words">
            {trend.name}
          </h3>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-2xl font-extralight text-foreground">
            {trend.seerScore}
          </div>
          <div className="text-xs text-muted-foreground">score</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {trend.description}
      </p>

      {/* Lead time badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-secondary to-transparent rounded-full mb-4">
        <span className="text-lg">⟳</span>
        <span className="text-sm font-light text-secondary-foreground">
          ~{trend.leadTime} days to peak
        </span>
      </div>

      {/* Sparkline */}
      <div className="mb-4">
        <svg width="100%" height="40" preserveAspectRatio="none" viewBox="0 0 100 30">
          <path
            d={sparklinePath()}
            fill="none"
            stroke={isHovered ? 'var(--accent-color)' : '#a8a29e'}
            strokeWidth="1.5"
            className="transition-colors"
          />
        </svg>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>14 days ago</span>
          <span className="text-[var(--accent-color)]">+{trend.velocity}%</span>
          <span>now</span>
        </div>
      </div>

      {/* Status pills */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${
          trend.saturation === 'Low' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
          trend.saturation === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        }`}>
          {trend.saturation} Saturation
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${
          trend.novelty === 'High' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
          trend.novelty === 'Medium' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
          'bg-secondary text-muted-foreground'
        }`}>
          {trend.novelty} Novelty
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          onClick={handleFollowClick}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-secondary rounded-full transition-colors"
        >
          <span className={isFollowing ? 'text-[var(--accent-color)]' : 'text-muted-foreground'}>
            {isFollowing ? '◉' : '◯'}
          </span>
          <span className="text-sm text-muted-foreground">
            {isFollowing ? 'Following' : 'Follow'}
          </span>
        </button>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-secondary rounded-full transition-colors">
            <span className="text-muted-foreground">⤴</span>
          </button>
          <button className="p-1.5 hover:bg-secondary rounded-full transition-colors">
            <span className="text-muted-foreground">⋯</span>
          </button>
        </div>
      </div>
    </div>
  );
}