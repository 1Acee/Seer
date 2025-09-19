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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extralight text-stone-900 dark:text-stone-100 font-['Playfair_Display'] italic">
                All Trends
              </h1>
              <p className="text-stone-500 dark:text-stone-400 text-sm mt-2">
                {filteredTrends.length} trends discovered across {categories.length} categories
              </p>
            </div>
            
            {/* View controls */}
            <div className="flex items-center gap-4">
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>

          {/* Temporary search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trends, categories, or hashtags..."
              className="w-full pl-12 pr-4 py-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">⊙</span>
          </div>
        </div>
      </div>

      {/* Main content with temporary filters */}
      <div className="flex">
        {/* Temporary filters sidebar */}
        <div className="w-80 border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6">
          <h3 className="text-lg font-light text-stone-900 dark:text-stone-100 mb-4">Filters</h3>
          
          {/* Simple category checkboxes */}
          <div className="mb-6">
            <h4 className="text-sm text-stone-600 dark:text-stone-400 mb-2">Categories</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {categories.map(category => (
                <label key={category} className="flex items-center gap-2 cursor-pointer">
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
                    className="w-4 h-4 rounded border-stone-300 text-[#FF6B6B] focus:ring-[#FF6B6B]"
                  />
                  <span className="text-sm text-stone-700 dark:text-stone-300">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort by */}
          <div className="mb-6">
            <h4 className="text-sm text-stone-600 dark:text-stone-400 mb-2">Sort By</h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-sm"
            >
              <option value="score">Seer Score</option>
              <option value="velocity">Velocity</option>
              <option value="leadTime">Lead Time</option>
              <option value="recent">Recently Updated</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSelectedCategories([]);
              setSaturationFilter('all');
              setTimeframe('all');
              setSearchQuery('');
              setSortBy('score');
            }}
            className="w-full px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full hover:scale-105 transition-transform text-sm"
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
              <h3 className="text-xl font-light text-stone-600 dark:text-stone-400 mb-2">
                No trends found
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-500">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Temporary modal for selected trend */}
      {selectedTrend && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedTrend(null)}
        >
          <div 
            className="bg-white dark:bg-stone-900 rounded-3xl p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-light text-stone-900 dark:text-stone-100 mb-4">
              {selectedTrend.name}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mb-4">
              {selectedTrend.description}
            </p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-2xl font-light">{selectedTrend.seerScore}</div>
                <div className="text-sm text-stone-500">Seer Score</div>
              </div>
              <div>
                <div className="text-2xl font-light">{selectedTrend.leadTime} days</div>
                <div className="text-sm text-stone-500">To Peak</div>
              </div>
              <div>
                <div className="text-2xl font-light">+{selectedTrend.velocity}%</div>
                <div className="text-sm text-stone-500">Velocity</div>
              </div>
            </div>
            <button
              onClick={() => setSelectedTrend(null)}
              className="w-full px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full hover:scale-105 transition-transform"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}