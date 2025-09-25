// File: components/dashboard/CategorySpotlight.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

interface CategorySpotlightProps {
  categories: string[];
  className?: string;
}

// Mock trending items by category - replace with API
const trendsByCategory: Record<string, Array<{
  id: string;
  name: string;
  velocity: number;
  saturation: number;
}>> = {
  beauty: [
    { id: "b1", name: "Glass Skin Routine", velocity: 15.2, saturation: 32 },
    { id: "b2", name: "Blush Contouring", velocity: 12.8, saturation: 28 },
    { id: "b3", name: "Skinimalism", velocity: 8.4, saturation: 45 }
  ],
  fashion: [
    { id: "f1", name: "Quiet Luxury", velocity: 22.1, saturation: 18 },
    { id: "f2", name: "Dopamine Dressing", velocity: 18.7, saturation: 35 },
    { id: "f3", name: "Tech Wear Aesthetic", velocity: 14.2, saturation: 22 }
  ],
  tech: [
    { id: "t1", name: "AI Companions", velocity: 28.4, saturation: 12 },
    { id: "t2", name: "Digital Minimalism", velocity: 19.3, saturation: 38 },
    { id: "t3", name: "Smart Rings", velocity: 16.8, saturation: 15 }
  ],
  fitness: [
    { id: "ft1", name: "Silent Walking", velocity: 18.9, saturation: 8 },
    { id: "ft2", name: "Primal Movement", velocity: 14.3, saturation: 22 },
    { id: "ft3", name: "Zone 2 Training", velocity: 11.7, saturation: 41 }
  ],
  lifestyle: [
    { id: "l1", name: "Slow Living", velocity: 16.2, saturation: 34 },
    { id: "l2", name: "Digital Detox", velocity: 13.8, saturation: 29 },
    { id: "l3", name: "Mindful Consumption", velocity: 9.4, saturation: 52 }
  ]
};

const categorySymbols: Record<string, string> = {
  beauty: "◐",
  fashion: "◑",
  tech: "◔",
  fitness: "◓",
  lifestyle: "◖",
  food: "◒",
  gaming: "◗",
  music: "◘",
  home: "◙"
};

export default function CategorySpotlight({ categories, className = "" }: CategorySpotlightProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0] || "beauty");
  const [isRotating, setIsRotating] = useState(true);

  // Auto-rotate categories
  useEffect(() => {
    if (!isRotating || categories.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveCategory(prev => {
        const currentIndex = categories.indexOf(prev);
        return categories[(currentIndex + 1) % categories.length];
      });
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(interval);
  }, [categories, isRotating]);

  const trends = trendsByCategory[activeCategory] || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`bg-card rounded-3xl p-8 shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extralight text-foreground mb-2">
            Category Spotlight
          </h2>
          <p className="text-sm text-muted-foreground font-light">
            Top emerging trends by domain • Auto-rotating
          </p>
        </div>
        
        {/* Rotation control */}
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isRotating ? 'Pause' : 'Resume'}
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        {categories.map(cat => (
          <motion.button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setIsRotating(false); // Stop auto-rotate on manual selection
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all
                       ${activeCategory === cat 
                         ? 'bg-foreground text-background' 
                         : 'bg-secondary text-muted-foreground hover:bg-muted'}`}
          >
            <span className="text-lg">{categorySymbols[cat] || "◯"}</span>
            <span className="text-sm font-light capitalize">{cat}</span>
          </motion.button>
        ))}
      </div>

      {/* Trends for active category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trends.map((trend, index) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group"
          >
            <Link href={`/trends/${trend.id}`}>
              <div className="p-5 rounded-2xl bg-background hover:bg-card hover:shadow-lg 
                            transition-all duration-300 cursor-pointer">
                {/* Trend name */}
                <h3 className="text-base font-light text-foreground mb-3">
                  {trend.name}
                </h3>
                
                {/* Metrics */}
                <div className="space-y-2">
                  {/* Velocity */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Velocity</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-secondary-foreground">+{trend.velocity}%</span>
                      <span style={{ color: 'var(--accent-color)' }}>↗</span>
                    </div>
                  </div>
                  
                  {/* Saturation bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Saturation</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full"
                          style={{ 
                            background: trend.saturation < 30 ? 'var(--accent-color)' : '#9a8d7d',
                            width: `${trend.saturation}%`
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${trend.saturation}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{trend.saturation}%</span>
                    </div>
                  </div>
                </div>

                {/* Hover action */}
                <div className="mt-4 pt-3 border-t border-stone-200 opacity-0 group-hover:opacity-100 
                              transition-opacity">
                  <span className="text-xs" style={{ color: 'var(--accent-color)' }}>
                    View analysis →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Insights for this category */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-4 bg-gradient-to-r from-stone-50 to-transparent rounded-2xl"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl" style={{ color: 'var(--accent-color)' }}>◎</span>
          <div>
            <p className="text-sm text-secondary-foreground font-light mb-1">
              <strong className="font-medium">Insight:</strong> {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} trends 
              are showing {trends[0]?.velocity > 20 ? 'exceptional' : 'strong'} growth patterns this week
            </p>
            <p className="text-xs text-muted-foreground">
              Consider creating content around low-saturation opportunities
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}