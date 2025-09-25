'use client';

import { useState, useMemo, useCallback } from 'react';
import TrendsGrid from '@/components/trends/TrendsGrid';
import ViewToggle from '@/components/trends/ViewToggle';
import { mockTrends, categories, TrendData } from '@/utils/mockTrendsData';

export default function TrendsPage() {
  // State management
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [saturationFilter, setSaturationFilter] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('score');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null);

  // Filter and sort trends
  const filteredTrends = useMemo(() => {
    let filtered = [...mockTrends];

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(trend => 
        selectedCategories.includes(trend.category)
      );
    }

    // Saturation filter
    if (saturationFilter !== 'all') {
      filtered = filtered.filter(trend => 
        trend.saturation.toLowerCase() === saturationFilter
      );
    }

    // Timeframe filter (by lead time)
    if (timeframe !== 'all') {
      const maxDays = timeframe === '7' ? 7 : timeframe === '14' ? 14 : 30;
      filtered = filtered.filter(trend => trend.leadTime <= maxDays);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trend => 
        trend.name.toLowerCase().includes(query) ||
        trend.description.toLowerCase().includes(query) ||
        trend.category.toLowerCase().includes(query) ||
        trend.hashtags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'score':
        filtered.sort((a, b) => b.seerScore - a.seerScore);
        break;
      case 'velocity':
        filtered.sort((a, b) => b.velocity - a.velocity);
        break;
      case 'leadTime':
        filtered.sort((a, b) => a.leadTime - b.leadTime);
        break;
      case 'recent':
        filtered.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
        break;
      default:
        break;
    }

    return filtered;
  }, [selectedCategories, saturationFilter, timeframe, sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Fixed to use proper background */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extralight text-foreground font-['Playfair_Display'] italic">
                All Trends
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                {filteredTrends.length} trends discovered across {categories.length} categories
              </p>
            </div>
            
            {/* View controls */}
            <div className="flex items-center gap-4">
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trends, categories, or hashtags..."
              className="w-full pl-12 pr-4 py-3 bg-secondary rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2"
              style={{
                '--tw-ring-color': 'rgba(var(--accent-rgb), 0.2)'
              } as React.CSSProperties}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">⊙</span>
          </div>
        </div>
      </div>

      {/* Main content with filters */}
      <div className="flex">
        {/* Filters sidebar with custom checkbox styling */}
        <div className="w-80 border-r border-border bg-card p-6">
          <h3 className="text-lg font-light text-foreground mb-4">Filters</h3>
          
          {/* Category checkboxes with custom styling */}
          <div className="mb-6">
            <h4 className="text-sm text-muted-foreground mb-2">Categories</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {categories.map(category => (
                <label key={category} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(c => c !== category));
                        }
                      }}
                      className="sr-only"
                    />
                    <div 
                      className={`w-4 h-4 rounded transition-all ${
                        selectedCategories.includes(category)
                          ? 'scale-110'
                          : 'border-2 border-border group-hover:border-muted-foreground'
                      }`}
                      style={{
                        backgroundColor: selectedCategories.includes(category) 
                          ? 'var(--accent-color)' 
                          : 'transparent',
                        borderColor: selectedCategories.includes(category)
                          ? 'var(--accent-color)'
                          : undefined
                      }}
                    >
                      {selectedCategories.includes(category) && (
                        <svg className="w-4 h-4 text-white" viewBox="0 0 16 16">
                          <path
                            fill="currentColor"
                            d="M13.5 3.5L6 11l-3.5-3.5L1 9l5 5L15 5z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-secondary-foreground">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort by */}
          <div className="mb-6">
            <h4 className="text-sm text-muted-foreground mb-2">Sort By</h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2"
              style={{
                '--tw-ring-color': 'rgba(var(--accent-rgb), 0.2)'
              } as React.CSSProperties}
            >
              <option value="score">Seer Score</option>
              <option value="velocity">Velocity</option>
              <option value="leadTime">Lead Time</option>
              <option value="recent">Recently Updated</option>
            </select>
          </div>

          {/* Timeframe filter with radio buttons */}
          <div className="mb-6">
            <h4 className="text-sm text-muted-foreground mb-3">Peak Timeframe</h4>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All timeframes' },
                { value: '7', label: 'Next 7 days' },
                { value: '14', label: 'Next 14 days' },
                { value: '30', label: 'Next 30 days' }
              ].map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative">
                    <input
                      type="radio"
                      name="timeframe"
                      value={option.value}
                      checked={timeframe === option.value}
                      onChange={(e) => setTimeframe(e.target.value)}
                      className="sr-only"
                    />
                    <div 
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        timeframe === option.value
                          ? ''
                          : 'border-border group-hover:border-muted-foreground'
                      }`}
                      style={{
                        borderColor: timeframe === option.value 
                          ? 'var(--accent-color)' 
                          : undefined,
                        backgroundColor: timeframe === option.value 
                          ? 'var(--accent-color)' 
                          : 'transparent'
                      }}
                    >
                      {timeframe === option.value && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-secondary-foreground">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Saturation filter */}
          <div className="mb-6">
            <h4 className="text-sm text-muted-foreground mb-3">Saturation Level</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setSaturationFilter(option.value)}
                  className={`px-3 py-2 rounded-xl text-sm transition-all transform hover:scale-105 ${
                    saturationFilter === option.value
                      ? 'ring-2'
                      : 'bg-secondary text-muted-foreground hover:bg-muted'
                  }`}
                  style={{
                    backgroundColor: saturationFilter === option.value 
                      ? 'rgba(var(--accent-rgb), 0.1)' 
                      : undefined,
                    color: saturationFilter === option.value 
                      ? 'var(--accent-color)' 
                      : undefined,
                    '--tw-ring-color': 'var(--accent-color)'
                  } as React.CSSProperties}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedCategories([]);
              setSaturationFilter('all');
              setTimeframe('all');
              setSearchQuery('');
              setSortBy('score');
            }}
            className="w-full px-4 py-2 rounded-full hover:scale-105 transition-transform text-sm text-white"
            style={{ backgroundColor: 'var(--accent-color)' }}
          >
            Clear all filters
          </button>
        </div>

        {/* Trends grid/list */}
        <div className="flex-1 p-8">
          {filteredTrends.length > 0 ? (
            <TrendsGrid
              trends={filteredTrends}
              viewMode={viewMode}
              onTrendClick={setSelectedTrend}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="text-6xl mb-4 opacity-20">◯</div>
              <h3 className="text-xl font-light text-muted-foreground mb-2">
                No trends found
              </h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for selected trend */}
      {selectedTrend && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedTrend(null)}
        >
          <div 
            className="bg-card rounded-3xl p-8 max-w-2xl w-full border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-light text-foreground mb-4">
              {selectedTrend.name}
            </h2>
            <p className="text-muted-foreground mb-4">
              {selectedTrend.description}
            </p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-2xl font-light text-foreground">{selectedTrend.seerScore}</div>
                <div className="text-sm text-muted-foreground">Seer Score</div>
              </div>
              <div>
                <div className="text-2xl font-light text-foreground">{selectedTrend.leadTime} days</div>
                <div className="text-sm text-muted-foreground">To Peak</div>
              </div>
              <div>
                <div className="text-2xl font-light" style={{ color: 'var(--accent-color)' }}>
                  +{selectedTrend.velocity}%
                </div>
                <div className="text-sm text-muted-foreground">Velocity</div>
              </div>
            </div>
            <button
              onClick={() => setSelectedTrend(null)}
              className="w-full px-4 py-2 rounded-full hover:scale-105 transition-transform text-white"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}