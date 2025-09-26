// File: app/(main)/dashboard/trends/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import TrendsGrid from '@/components/trends/TrendsGrid';
import TrendsFilters from '@/components/trends/TrendsFilters';
import ViewToggle from '@/components/trends/ViewToggle';
import SwipeMode from '@/components/trends/SwipeMode';
import { mockTrends, TrendData } from '@/utils/mockTrendsData';

export default function TrendsPage() {
  // Get user's selected categories from localStorage
  const [userCategories, setUserCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [saturationFilter, setSaturationFilter] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('score');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'swipe'>('grid');
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null);

  // Load user's selected categories from localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('userSelectedCategories');
    if (savedCategories) {
      const categories = JSON.parse(savedCategories);
      // Map the category IDs to proper labels
      const categoryLabels = categories.map((id: string) => {
        const categoryMap: { [key: string]: string } = {
          'beauty': 'Beauty',
          'fashion': 'Fashion',
          'food': 'Food & Beverage',
          'fitness': 'Fitness',
          'tech': 'Technology',
          'finance': 'Finance',
          'lifestyle': 'Lifestyle',
          'gaming': 'Gaming',
          'music': 'Music',
          'home': 'Home & DIY',
          'photography': 'Photography',
          'automotive': 'Automotive',
          'travel': 'Travel',
          'education': 'Education'
        };
        return categoryMap[id] || id;
      });
      setUserCategories(categoryLabels);
    }
  }, []);

  // Filter trends to only show those in user's selected categories
  const filteredTrends = useMemo(() => {
    let filtered = [...mockTrends];

    // First, filter by user's onboarding categories
    if (userCategories.length > 0) {
      filtered = filtered.filter(trend => 
        userCategories.includes(trend.category)
      );
    }

    // Then apply additional filters
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

    // Timeframe filter
    if (timeframe !== 'all') {
      const maxDays = parseInt(timeframe);
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
    }

    return filtered;
  }, [userCategories, selectedCategories, saturationFilter, timeframe, sortBy, searchQuery]);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSaturationFilter('all');
    setTimeframe('all');
    setSortBy('score');
  };

  const activeFilterCount = selectedCategories.length + 
    (saturationFilter !== 'all' ? 1 : 0) + 
    (timeframe !== 'all' ? 1 : 0);

  // If in swipe mode, render SwipeMode component
  if (viewMode === 'swipe') {
    return (
      <SwipeMode 
        trends={filteredTrends} 
        onClose={() => setViewMode('grid')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extralight text-foreground font-['Playfair_Display'] italic">
                All Trends
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                {filteredTrends.length} trends discovered in your {userCategories.length} selected categories
              </p>
            </div>
            
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
        {/* Filters sidebar */}
        <div className="w-80 border-r border-border bg-card">
          <TrendsFilters
            selectedCategories={selectedCategories}
            availableCategories={userCategories} // Pass user's categories
            onCategoryToggle={handleCategoryToggle}
            saturationFilter={saturationFilter}
            setSaturationFilter={setSaturationFilter}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onClearAll={handleClearAll}
            activeFilterCount={activeFilterCount}
          />
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