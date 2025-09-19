'use client';

import { useState, useEffect } from 'react';

interface TrendsSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultCount: number;
}

export default function TrendsSearch({ searchQuery, setSearchQuery, resultCount }: TrendsSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow clicks on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative">
      <div
        className={`relative flex items-center rounded-2xl transition-all duration-200 ${
          isFocused ? 'ring-2 ring-[#FF6B6B]/20 scale-[1.02]' : ''
        }`}
      >
        {/* Search icon */}
        <div className="absolute left-4 pointer-events-none">
          <span className="text-stone-400 dark:text-stone-500 text-lg">
            ⊙
          </span>
        </div>

        {/* Input field */}
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search trends, categories, or hashtags..."
          className="w-full pl-12 pr-32 py-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-500 focus:outline-none transition-colors"
        />

        {/* Right side actions */}
        <div className="absolute right-2 flex items-center gap-2">
          {/* Result count */}
          {localQuery && (
            <div className="px-3 py-1 bg-white dark:bg-stone-900 rounded-full animate-fadeIn">
              <span className="text-xs text-stone-600 dark:text-stone-400">
                {resultCount} results
              </span>
            </div>
          )}

          {/* Clear button */}
          {localQuery && (
            <button
              onClick={handleClear}
              className="p-2 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full transition-all hover:rotate-90 animate-fadeIn"
            >
              <span className="text-stone-500 dark:text-stone-400">✕</span>
            </button>
          )}

          {/* Search button */}
          <button className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full hover:scale-105 transition-transform text-sm">
            Search
          </button>
        </div>
      </div>

      {/* Search suggestions */}
      {showSuggestions && !localQuery && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 z-10 animate-slideDown">
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Popular searches</p>
          <div className="flex flex-wrap gap-2">
            {['Glass Skin', 'AI Tools', 'Micro-HIIT', 'Silent Luxury', 'Dopamine Decor'].map(suggestion => (
              <button
                key={suggestion}
                onClick={() => {
                  setLocalQuery(suggestion);
                  setSearchQuery(suggestion);
                }}
                className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-full text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all hover:scale-105"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}