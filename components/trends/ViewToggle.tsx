// File: components/trends/ViewToggle.tsx
'use client';

interface ViewToggleProps {
  viewMode: 'grid' | 'list' | 'swipe';
  setViewMode: (mode: 'grid' | 'list' | 'swipe') => void;
}

export default function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  const getTranslateX = () => {
    switch(viewMode) {
      case 'grid': return '0';
      case 'list': return '80px';
      case 'swipe': return '160px';
      default: return '0';
    }
  };

  const getWidth = () => {
    switch(viewMode) {
      case 'grid': return '76px';
      case 'list': return '72px';
      case 'swipe': return '88px';
      default: return '76px';
    }
  };

  return (
    <div className="relative flex items-center bg-secondary rounded-full p-1">
      {/* Background pill that moves */}
      <div
        className="absolute h-8 bg-card rounded-full shadow-sm transition-all duration-300 ease-out"
        style={{
          transform: `translateX(${getTranslateX()})`,
          width: getWidth()
        }}
      />

      {/* Grid button */}
      <button
        onClick={() => setViewMode('grid')}
        className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full transition-colors ${
          viewMode === 'grid' 
            ? 'text-foreground' 
            : 'text-muted-foreground hover:text-secondary-foreground'
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
            ? 'text-foreground' 
            : 'text-muted-foreground hover:text-secondary-foreground'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="2" width="14" height="3" stroke="currentColor" strokeWidth="1.5" rx="1"/>
          <rect x="1" y="7" width="14" height="3" stroke="currentColor" strokeWidth="1.5" rx="1"/>
          <rect x="1" y="12" width="14" height="3" stroke="currentColor" strokeWidth="1.5" rx="1"/>
        </svg>
        <span className="text-sm">List</span>
      </button>

      {/* Swipe button */}
      <button
        onClick={() => setViewMode('swipe')}
        className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full transition-colors ${
          viewMode === 'swipe' 
            ? 'text-foreground' 
            : 'text-muted-foreground hover:text-secondary-foreground'
        }`}
      >
        <div className="relative w-4 h-4">
          {/* Card stack icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-4 border border-current rounded transform rotate-[-8deg] translate-x-[-2px]"></div>
            <div className="absolute w-3 h-4 border border-current rounded transform rotate-[8deg] translate-x-[2px]"></div>
          </div>
        </div>
        <span className="text-sm">Swipe</span>
      </button>
    </div>
  );
}