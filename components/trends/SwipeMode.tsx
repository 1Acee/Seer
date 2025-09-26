// File: components/trends/SwipeMode.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { TrendData } from '@/utils/mockTrendsData';
import { useWatchlist } from '@/contexts/WatchlistContext';

interface SwipeModeProps {
  trends: TrendData[];
  onClose: () => void;
}

export default function SwipeMode({ trends, onClose }: SwipeModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [addedCount, setAddedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const { addToWatchlist } = useWatchlist();

  const currentTrend = trends[currentIndex];
  const isComplete = currentIndex >= trends.length;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showTutorial) {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
          setShowTutorial(false);
        }
        return;
      }

      if (!isComplete) {
        if (e.key === 'ArrowLeft') {
          handleSwipe('left');
        } else if (e.key === 'ArrowRight') {
          handleSwipe('right');
        }
      }
      
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, showTutorial, isComplete]);

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (isComplete) return;
    
    setSwipeDirection(direction);
    
    if (direction === 'right' && currentTrend) {
      addToWatchlist(currentTrend);
      setAddedCount(prev => prev + 1);
    } else {
      setSkippedCount(prev => prev + 1);
    }

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 300);
  }, [currentIndex, currentTrend, isComplete, addToWatchlist]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      handleSwipe('left');
    }
  };

  // Generate chart data for visualization
  const generateChartPath = () => {
    if (!currentTrend) return '';
    const points = currentTrend.momentum.map((value, index) => ({
      x: (index / (currentTrend.momentum.length - 1)) * 100,
      y: 50 - (value / 100) * 40
    }));

    return points.reduce((acc, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');
  };

  // Completion screen
  if (isComplete && !showTutorial) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-8"
        >
          {/* Subtle geometric animation */}
          <div className="relative mb-8">
            <motion.div
              className="w-32 h-32 mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Elegant completion symbol */}
              <svg viewBox="0 0 128 128" className="w-full h-full">
                <motion.circle
                  cx="64"
                  cy="64"
                  r="60"
                  fill="none"
                  stroke="var(--accent-color)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="40"
                  fill="none"
                  stroke="var(--accent-color)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.2 }}
                  transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
                />
                <motion.path
                  d="M 44 64 L 58 78 L 84 50"
                  fill="none"
                  stroke="var(--accent-color)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.8 }}
                />
              </svg>
            </motion.div>

            {/* Subtle floating particles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ 
                  backgroundColor: 'var(--accent-color)',
                  left: `${30 + i * 20}%`,
                  top: '50%'
                }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ 
                  opacity: [0, 0.3, 0],
                  y: -30,
                }}
                transition={{ 
                  duration: 2,
                  delay: 0.5 + i * 0.2,
                  repeat: 1,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-extralight text-foreground mb-4 font-['Playfair_Display'] italic"
          >
            That's it for today
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-muted-foreground mb-8 font-light leading-relaxed"
          >
            See you tomorrow with fresh trends to explore
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-8 mb-12"
          >
            <div className="text-center">
              <div className="text-2xl font-extralight text-foreground">{trends.length}</div>
              <div className="text-sm text-muted-foreground">reviewed</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-extralight" style={{ color: 'var(--accent-color)' }}>
                {addedCount}
              </div>
              <div className="text-sm text-muted-foreground">curated</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-extralight text-foreground">{skippedCount}</div>
              <div className="text-sm text-muted-foreground">passed</div>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={onClose}
            className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-all"
          >
            Return to trends
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header - Only show when not in tutorial */}
      {!showTutorial && (
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-3 hover:bg-secondary rounded-full transition-colors"
            >
              <span className="text-xl text-muted-foreground">←</span>
            </button>
            <div>
              <h2 className="text-lg font-light text-foreground">Today's Trends</h2>
              <p className="text-sm text-muted-foreground">
                {currentIndex + 1} of {trends.length}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex-1 max-w-xs mx-8">
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <motion.div 
                className="h-full rounded-full"
                style={{ 
                  backgroundColor: 'var(--accent-color)'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / trends.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main swipe area */}
      {!showTutorial && currentTrend && (
        <div className="h-full flex items-center justify-center px-8 py-24">
          {/* Clickable pass button */}
          <button
            onClick={() => handleSwipe('left')}
            className="absolute left-8 top-1/2 -translate-y-1/2 z-20 p-4 hover:bg-red-500/10 rounded-full transition-colors group"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/10 group-hover:bg-red-500/20 flex items-center justify-center transition-colors">
              <span className="text-3xl text-red-500/60">✕</span>
            </div>
          </button>

          {/* Clickable curate button */}
          <button
            onClick={() => handleSwipe('right')}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-20 p-4 hover:bg-green-500/10 rounded-full transition-colors group"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/10 group-hover:bg-green-500/20 flex items-center justify-center transition-colors">
              <span className="text-3xl text-green-500/60">♥</span>
            </div>
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrend.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              animate={{
                x: swipeDirection === 'left' ? -1000 : 
                   swipeDirection === 'right' ? 1000 : 0,
                opacity: swipeDirection ? 0 : 1,
                rotate: swipeDirection === 'left' ? -15 : 
                        swipeDirection === 'right' ? 15 : 0
              }}
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-4xl cursor-grab active:cursor-grabbing"
            >
              <div className="bg-card rounded-3xl p-8 shadow-2xl border border-border">
                {/* Trend header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                        {currentTrend.category}
                      </span>
                      <span className="text-4xl font-extralight text-foreground">
                        {currentTrend.seerScore}
                      </span>
                      <span className="text-sm text-muted-foreground">score</span>
                    </div>
                    <h1 className="text-4xl font-light text-foreground font-['Playfair_Display'] italic mb-3">
                      {currentTrend.name}
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {currentTrend.description}
                    </p>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-col gap-2 ml-6">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      currentTrend.saturation === 'Low' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      currentTrend.saturation === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {currentTrend.saturation} Saturation
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      currentTrend.novelty === 'High' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                      currentTrend.novelty === 'Medium' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {currentTrend.novelty} Novelty
                    </span>
                  </div>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-background rounded-2xl text-center">
                    <div className="text-2xl font-light text-foreground mb-1">
                      ~{currentTrend.leadTime}
                    </div>
                    <div className="text-xs text-muted-foreground">days to peak</div>
                  </div>
                  <div className="p-4 bg-background rounded-2xl text-center">
                    <div className="text-2xl font-light" style={{ color: 'var(--accent-color)' }}>
                      +{currentTrend.velocity}%
                    </div>
                    <div className="text-xs text-muted-foreground">velocity</div>
                  </div>
                  <div className="p-4 bg-background rounded-2xl text-center">
                    <div className="text-2xl font-light text-foreground">
                      {currentTrend.confidence}%
                    </div>
                    <div className="text-xs text-muted-foreground">confidence</div>
                  </div>
                  <div className="p-4 bg-background rounded-2xl text-center">
                    <div className="text-2xl font-light text-foreground">
                      {Object.values(currentTrend.evidence).reduce((a, b) => a + b, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">signals</div>
                  </div>
                </div>

                {/* Momentum visualization */}
                <div className="bg-background rounded-2xl p-4 mb-6">
                  <svg width="100%" height="80" viewBox="0 0 100 60" preserveAspectRatio="none">
                    <path
                      d={generateChartPath()}
                      fill="none"
                      stroke="var(--accent-color)"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                    <path
                      d={generateChartPath()}
                      fill="url(#gradient)"
                      opacity="0.1"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-2">
                  {currentTrend.hashtags.slice(0, 6).map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-background flex flex-col items-center justify-center"
          >
            {/* Demo card animation area */}
            <div className="relative w-full max-w-2xl h-96 mb-12">
              <DemoCardAnimation />
            </div>

            {/* Instructions text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center max-w-lg mx-8"
            >
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-4xl font-extralight text-foreground mb-6 font-['Playfair_Display'] italic"
              >
                Customise your trends
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-xl text-muted-foreground mb-8 font-light leading-relaxed"
              >
                Swipe right to add to your watchlist, or left if it's not for you
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex items-center justify-center gap-8 mb-8 text-base text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-secondary rounded text-sm">←</kbd>
                  <span>or drag left to pass</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-secondary rounded text-sm">→</kbd>
                  <span>or drag right to save</span>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTutorial(false)}
                className="px-10 py-3 rounded-full transition-all text-lg font-light"
                style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
              >
                Get Trending
              </motion.button>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-sm text-muted-foreground mt-4"
              >
                Press Space, Enter, or ESC to start
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Demo card animation component
function DemoCardAnimation() {
  const demoTrends = [
    { 
      name: 'Glass Skin Aesthetic', 
      category: 'Beauty',
      score: 92,
      bgColor: 'rgba(255, 107, 107, 0.05)' // Soft coral tint
    },
    { 
      name: 'Micro-HIIT Workouts', 
      category: 'Fitness',
      score: 88,
      bgColor: 'rgba(107, 255, 184, 0.05)' // Soft mint tint
    },
    { 
      name: 'Silent Luxury', 
      category: 'Fashion',
      score: 95,
      bgColor: 'rgba(107, 184, 255, 0.05)' // Soft blue tint
    }
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {demoTrends.map((trend, index) => (
        <motion.div
          key={trend.name}
          className="absolute w-80 rounded-2xl p-6 shadow-xl border border-border"
          style={{ 
            backgroundColor: trend.bgColor,
            zIndex: 3 - index 
          }}
          animate={{
            x: [0, index % 2 === 0 ? 400 : -400, 0],
            rotate: [0, index % 2 === 0 ? 20 : -20, 0],
            opacity: [1, 0, 0, 1],
            scale: [1, 0.9, 0.9, 1]
          }}
          transition={{
            duration: 3,
            delay: index * 1.5,
            repeat: Infinity,
            repeatDelay: 1,
            ease: 'easeInOut'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground">
              {trend.category}
            </span>
            <span className="text-2xl font-extralight text-foreground">{trend.score}</span>
          </div>
          <h3 className="text-xl font-light font-['Playfair_Display'] italic mb-2 text-foreground">
            {trend.name}
          </h3>
          <div className="h-px bg-border my-3" />
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>~7 days to peak</span>
            <span>+45% velocity</span>
          </div>
        </motion.div>
      ))}

      {/* Swipe direction indicators */}
      <motion.div
        className="absolute -left-24 top-1/2 -translate-y-1/2"
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <span className="text-2xl text-red-500/50">✕</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute -right-24 top-1/2 -translate-y-1/2"
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      >
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
          <span className="text-2xl text-green-500/50">♥</span>
        </div>
      </motion.div>
    </div>
  );
}