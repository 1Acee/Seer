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
          isFocused ? 'ring-2 ring-accent/20 scale-[1.02]' : ''
        }`}
      >
        {/* Search icon */}
        <div className="absolute left-4 pointer-events-none">
          <span className="text-muted-foreground text-lg">
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
          className="w-full pl-12 pr-32 py-3 bg-secondary rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none transition-colors"
        />

        {/* Right side actions */}
        <div className="absolute right-2 flex items-center gap-2">
          {/* Result count */}
          {localQuery && (
            <div className="px-3 py-1 bg-card rounded-full animate-fadeIn">
              <span className="text-xs text-muted-foreground">
                {resultCount} results
              </span>
            </div>
          )}

          {/* Clear button */}
          {localQuery && (
            <button
              onClick={handleClear}
              className="p-2 hover:bg-muted rounded-full transition-all hover:rotate-90 animate-fadeIn"
            >
              <span className="text-muted-foreground">✕</span>
            </button>
          )}

          {/* Search button */}
          <button className="px-4 py-2 bg-foreground text-background rounded-full hover:scale-105 transition-transform text-sm">
            Search
          </button>
        </div>
      </div>

      {/* Search suggestions */}
      {showSuggestions && !localQuery && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-card rounded-2xl shadow-xl border border-border z-10 animate-slideDown">
          <p className="text-xs text-muted-foreground mb-3">Popular searches</p>
          <div className="flex flex-wrap gap-2">
            {['Glass Skin', 'AI Tools', 'Micro-HIIT', 'Silent Luxury', 'Dopamine Decor'].map(suggestion => (
              <button
                key={suggestion}
                onClick={() => {
                  setLocalQuery(suggestion);
                  setSearchQuery(suggestion);
                }}
                className="px-3 py-1.5 bg-secondary rounded-full text-sm text-secondary-foreground hover:bg-muted transition-all hover:scale-105"
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