'use client';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export default function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <div className="relative flex items-center bg-stone-100 dark:bg-stone-800 rounded-full p-1">
      {/* Background pill that moves - using CSS transitions instead of Framer Motion */}
      <div
        className="absolute h-8 bg-white dark:bg-stone-700 rounded-full shadow-sm transition-all duration-300 ease-out"
        style={{
          transform: `translateX(${viewMode === 'grid' ? '0' : '80px'})`,
          width: viewMode === 'grid' ? '76px' : '72px'
        }}
      />

      {/* Grid button */}
      <button
        onClick={() => setViewMode('grid')}
        className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full transition-colors ${
          viewMode === 'grid' 
            ? 'text-stone-900 dark:text-stone-100' 
            : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.5" rx="1"/>
          <rect x="10" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.5" rx="1"/>
          <rect x="1" y="10" width="5" height="5" stroke="currentColor" strokeWidth="1.5" rx="1"/>
          <rect x="10" y="10" width="5" height="5" stroke="currentColor" strokeWidth="1.5" rx="1"/>
        </svg>
        <span className="text-sm">Grid</span>
      </button>

      {/* List button */}
      <button
        onClick={() => setViewMode('list')}
        className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full transition-colors ${
          viewMode === 'list' 
            ? 'text-stone-900 dark:text-stone-100' 
            : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="2" width="14" height="3" stroke="currentColor" strokeWidth="1.5" rx="1"/>
          <rect x="1" y="7" width="14" height="3" stroke="currentColor" strokeWidth="1.5" rx="1"/>
          <rect x="1" y="12" width="14" height="3" stroke="currentColor" strokeWidth="1.5" rx="1"/>
        </svg>
        <span className="text-sm">List</span>
      </button>
    </div>
  );
}