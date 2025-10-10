// components/dashboard/CategorySpotlight.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface CategorySpotlightProps {
  categories: string[];
  className?: string;
}

// Mock trending items by category
const trendsByCategory: Record<string, Array<{
  id: string;
  name: string;
  velocity: number;
  saturation: number;
  signals: number;
}>> = {
  beauty: [
    { id: "b1", name: "Glass Skin Routine", velocity: 15.2, saturation: 32, signals: 187 },
    { id: "b2", name: "Blush Contouring", velocity: 12.8, saturation: 28, signals: 134 },
    { id: "b3", name: "Skinimalism", velocity: 8.4, saturation: 45, signals: 92 }
  ],
  fashion: [
    { id: "f1", name: "Quiet Luxury", velocity: 22.1, saturation: 18, signals: 156 },
    { id: "f2", name: "Dopamine Dressing", velocity: 18.7, saturation: 35, signals: 143 },
    { id: "f3", name: "Tech Wear Aesthetic", velocity: 14.2, saturation: 22, signals: 98 }
  ],
  tech: [
    { id: "t1", name: "AI Companions", velocity: 28.4, saturation: 12, signals: 234 },
    { id: "t2", name: "Digital Minimalism", velocity: 19.3, saturation: 38, signals: 189 },
    { id: "t3", name: "Smart Rings", velocity: 16.8, saturation: 15, signals: 167 }
  ],
  fitness: [
    { id: "ft1", name: "Silent Walking", velocity: 18.9, saturation: 8, signals: 145 },
    { id: "ft2", name: "Primal Movement", velocity: 14.3, saturation: 22, signals: 112 },
    { id: "ft3", name: "Zone 2 Training", velocity: 11.7, saturation: 41, signals: 89 }
  ],
  lifestyle: [
    { id: "l1", name: "Slow Living", velocity: 16.2, saturation: 34, signals: 178 },
    { id: "l2", name: "Digital Detox", velocity: 13.8, saturation: 29, signals: 156 },
    { id: "l3", name: "Mindful Consumption", velocity: 9.4, saturation: 52, signals: 123 }
  ]
};

const categorySymbols: Record<string, string> = {
  beauty: "◐",
  fashion: "◑", 
  tech: "◔",
  fitness: "◓",
  lifestyle: "◖"
};

export default function CategorySpotlight({ categories, className = "" }: CategorySpotlightProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0] || "beauty");
  const [isRotating, setIsRotating] = useState(true);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Progress bar animation
  useEffect(() => {
    if (isRotating) {
      setProgress(0);
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 1.25; // 8 seconds = 100% / 8000ms * 100ms interval
        });
      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setProgress(0);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [activeCategory, isRotating]);

  // Auto-rotate categories
  useEffect(() => {
    if (!isRotating || categories.length <= 1) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }
    
    intervalRef.current = setInterval(() => {
      setActiveCategory(prev => {
        const currentIndex = categories.indexOf(prev);
        return categories[(currentIndex + 1) % categories.length];
      });
    }, 8000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [categories, isRotating]);

  const trends = trendsByCategory[activeCategory] || [];

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setIsRotating(false);
    setProgress(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`bg-card rounded-3xl p-8 shadow-lg border border-border ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extralight text-foreground mb-2">
            Category Spotlight
          </h2>
          <p className="text-sm text-muted-foreground font-light">
            Top emerging trends by domain • Auto-rotating every 8 seconds
          </p>
        </div>
        
        {/* Rotation control */}
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all
                     hover:bg-secondary text-muted-foreground hover:text-foreground"
        >
          {isRotating ? 'Pause Rotation' : 'Resume'}
        </button>
      </div>

      {/* Category tabs with progress indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <motion.button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all
                           ${isActive 
                             ? 'text-white' 
                             : 'bg-secondary text-muted-foreground hover:bg-muted'}`}
                style={{
                  backgroundColor: isActive ? 'var(--accent-color)' : undefined
                }}
              >
                {/* Progress indicator for active category */}
                {isActive && isRotating && (
                  <motion.div
                    className="absolute inset-0 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div 
                      className="absolute inset-0 bg-white/20"
                      style={{
                        transform: `translateX(-${100 - progress}%)`,
                        transition: 'transform 0.1s linear'
                      }}
                    />
                  </motion.div>
                )}
                
                <span className="text-lg relative z-10">
                  {categorySymbols[cat] || "◯"}
                </span>
                <span className="text-sm font-light capitalize relative z-10">
                  {cat}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Animated trends content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Trends grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trends.map((trend, index) => (
              <motion.div
                key={trend.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 24
                }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group"
              >
                <div className="p-6 rounded-2xl bg-secondary/30 border border-border
                              hover:border-accent/30 hover:shadow-lg 
                              transition-all duration-300 cursor-pointer">
                  {/* Trend name */}
                  <h3 className="text-base font-light text-foreground mb-4">
                    {trend.name}
                  </h3>
                  
                  {/* Metrics */}
                  <div className="space-y-3">
                    {/* Velocity */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Velocity</span>
                        <span className="text-xs" style={{ color: 'var(--accent-color)' }}>
                          +{trend.velocity}% ↗
                        </span>
                      </div>
                      <div className="h-1 bg-secondary rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full"
                          style={{ backgroundColor: 'var(--accent-color)' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(trend.velocity * 3, 100)}%` }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                        />
                      </div>
                    </div>
                    
                    {/* Saturation */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Saturation</span>
                        <span className="text-xs text-foreground">{trend.saturation}%</span>
                      </div>
                      <div className="h-1 bg-secondary rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full bg-muted-foreground"
                          initial={{ width: 0 }}
                          animate={{ width: `${trend.saturation}%` }}
                          transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom section */}
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {trend.signals} signals
                    </span>
                    <motion.span 
                      className="text-xs opacity-0 group-hover:opacity-100"
                      style={{ color: 'var(--accent-color)' }}
                    >
                      Analyze →
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Animated insight box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 rounded-2xl border flex items-start gap-4"
            style={{ 
              backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
              borderColor: 'rgba(var(--accent-rgb), 0.2)'
            }}
          >
            <motion.span 
              className="text-2xl"
              style={{ color: 'var(--accent-color)' }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
            >
              ◎
            </motion.span>
            <div>
              <p className="text-sm text-foreground mb-1">
                <strong className="font-medium">Weekly Insight:</strong> {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} trends 
                are showing {trends[0]?.velocity > 20 ? 'exceptional' : 'strong'} growth patterns 
                with {trends.filter(t => t.saturation < 30).length > 1 ? 'multiple' : 'limited'} low-saturation opportunities.
              </p>
              <p className="text-xs text-muted-foreground">
                Consider creating content around {trends[0]?.name.toLowerCase()} for maximum impact.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}