'use client';

import { categories } from '@/utils/mockTrendsData';

interface TrendsFiltersProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  saturationFilter: string;
  setSaturationFilter: (value: string) => void;
  timeframe: string;
  setTimeframe: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}

export default function TrendsFilters({
  selectedCategories,
  onCategoryToggle,
  saturationFilter,
  setSaturationFilter,
  timeframe,
  setTimeframe,
  sortBy,
  setSortBy,
  onClearAll,
  activeFilterCount
}: TrendsFiltersProps) {
  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-light text-stone-900 dark:text-stone-100">
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sort By */}
      <div className="mb-8">
        <h4 className="text-sm font-light text-stone-600 dark:text-stone-400 mb-3">
          Sort By
        </h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700 transition-all"
        >
          <option value="score">Seer Score</option>
          <option value="velocity">Velocity</option>
          <option value="leadTime">Lead Time</option>
          <option value="recent">Recently Updated</option>
        </select>
      </div>

      {/* Timeframe */}
      <div className="mb-8">
        <h4 className="text-sm font-light text-stone-600 dark:text-stone-400 mb-3">
          Peak Timeframe
        </h4>
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
                <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                  timeframe === option.value
                    ? 'border-[#FF6B6B] bg-[#FF6B6B]'
                    : 'border-stone-300 dark:border-stone-600 group-hover:border-stone-400 dark:group-hover:border-stone-500'
                }`}>
                  {timeframe === option.value && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
              </div>
              <span className="text-sm text-stone-700 dark:text-stone-300">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Saturation Level */}
      <div className="mb-8">
        <h4 className="text-sm font-light text-stone-600 dark:text-stone-400 mb-3">
          Saturation Level
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'all', label: 'All', color: 'stone' },
            { value: 'low', label: 'Low', color: 'green' },
            { value: 'medium', label: 'Medium', color: 'yellow' },
            { value: 'high', label: 'High', color: 'red' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setSaturationFilter(option.value)}
              className={`px-3 py-2 rounded-xl text-sm transition-all transform hover:scale-105 ${
                saturationFilter === option.value
                  ? option.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-2 ring-green-200 dark:ring-green-800' :
                    option.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 ring-2 ring-yellow-200 dark:ring-yellow-800' :
                    option.color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-2 ring-red-200 dark:ring-red-800' :
                    'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100 ring-2 ring-stone-300 dark:ring-stone-600'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-sm font-light text-stone-600 dark:text-stone-400 mb-3">
          Categories ({selectedCategories.length})
        </h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {categories.map(category => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => onCategoryToggle(category)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded transition-all ${
                  selectedCategories.includes(category)
                    ? 'bg-[#FF6B6B] border-[#FF6B6B] scale-110'
                    : 'border-2 border-stone-300 dark:border-stone-600 group-hover:border-stone-400 dark:group-hover:border-stone-500'
                }`}>
                  {selectedCategories.includes(category) && (
                    <svg className="w-4 h-4 text-white animate-checkmark" viewBox="0 0 16 16">
                      <path
                        fill="currentColor"
                        d="M13.5 3.5L6 11l-3.5-3.5L1 9l5 5L15 5z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-stone-700 dark:text-stone-300">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick filters */}
      <div className="mt-8 pt-8 border-t border-stone-200 dark:border-stone-800">
        <h4 className="text-sm font-light text-stone-600 dark:text-stone-400 mb-3">
          Quick Filters
        </h4>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all hover:translate-x-1 text-sm text-stone-700 dark:text-stone-300">
            ◈ Cross-platform Only
          </button>
          <button className="w-full text-left px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all hover:translate-x-1 text-sm text-stone-700 dark:text-stone-300">
            ◉ High Confidence (80%+)
          </button>
          <button className="w-full text-left px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all hover:translate-x-1 text-sm text-stone-700 dark:text-stone-300">
            ⟳ Rapid Growth (100%+ velocity)
          </button>
        </div>
      </div>
    </div>
  );
}