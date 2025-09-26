// File: components/trends/TrendsFilters.tsx
'use client';

interface TrendsFiltersProps {
  selectedCategories: string[];
  availableCategories: string[]; // Now passed from parent
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
  availableCategories, // Use this instead of imported categories
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
        <h3 className="text-lg font-light text-foreground">
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sort By */}
      <div className="mb-8">
        <h4 className="text-sm font-light text-muted-foreground mb-3">
          Sort By
        </h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-border transition-all"
        >
          <option value="score">Seer Score</option>
          <option value="velocity">Velocity</option>
          <option value="leadTime">Lead Time</option>
          <option value="recent">Recently Updated</option>
        </select>
      </div>

      {/* Timeframe */}
      <div className="mb-8">
        <h4 className="text-sm font-light text-muted-foreground mb-3">
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
                    ? 'border-[var(--accent-color)] bg-[var(--accent-color)]'
                    : 'border-border group-hover:border-muted-foreground'
                }`}>
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

      {/* Saturation Level */}
      <div className="mb-8">
        <h4 className="text-sm font-light text-muted-foreground mb-3">
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
                    'bg-muted text-foreground ring-2 ring-border'
                  : 'bg-secondary text-muted-foreground hover:bg-muted'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories - Now using availableCategories */}
      <div>
        <h4 className="text-sm font-light text-muted-foreground mb-3">
          Your Categories ({availableCategories.length})
        </h4>
        {availableCategories.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {availableCategories.map(category => (
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
                      ? 'bg-[var(--accent-color)] border-[var(--accent-color)] scale-110'
                      : 'border-2 border-border group-hover:border-muted-foreground'
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
                <span className="text-sm text-secondary-foreground">
                  {category}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic">
            No categories selected during onboarding
          </div>
        )}
      </div>

      {/* Quick filters */}
      <div className="mt-8 pt-8 border-t border-border">
        <h4 className="text-sm font-light text-muted-foreground mb-3">
          Quick Filters
        </h4>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 rounded-xl bg-secondary hover:bg-muted transition-all hover:translate-x-1 text-sm text-secondary-foreground">
            ◈ Cross-platform Only
          </button>
          <button className="w-full text-left px-3 py-2 rounded-xl bg-secondary hover:bg-muted transition-all hover:translate-x-1 text-sm text-secondary-foreground">
            ◉ High Confidence (80%+)
          </button>
          <button className="w-full text-left px-3 py-2 rounded-xl bg-secondary hover:bg-muted transition-all hover:translate-x-1 text-sm text-secondary-foreground">
            ⟳ Rapid Growth (100%+ velocity)
          </button>
        </div>
      </div>
    </div>
  );
}