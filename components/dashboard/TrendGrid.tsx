// File: components/dashboard/TrendGrid.tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import TrendTile from "./TrendTile";

interface TrendGridProps {
  selectedCategories: string[];
}

// Mock data with luxury palette consideration
const mockTrends = [
  {
    id: "1",
    name: "Quiet Luxury Aesthetic",
    category: "fashion",
    seerScore: 88,
    leadTime: "8 days",
    momentum: [32, 38, 45, 52, 58, 68, 78, 85],
    evidence: { reddit: 8, tiktok: 15, instagram: 22 } as Record<string, number>,
    status: ["Cross-Platform", "High Novelty"],
    velocity: 22.4
  },
  {
    id: "2",
    name: "Glass Skin Routine",
    category: "beauty",
    seerScore: 85,
    leadTime: "15 days",
    momentum: [28, 30, 33, 36, 40, 45, 50, 54],
    evidence: { tiktok: 28, youtube: 12, reddit: 5 } as Record<string, number>,
    status: ["Low Saturation"],
    velocity: 8.7
  },
  {
    id: "3",
    name: "Protein Coffee",
    category: "fitness",
    seerScore: 79,
    leadTime: "10 days",
    momentum: [22, 25, 28, 32, 38, 45, 51, 58],
    evidence: { reddit: 18, tiktok: 9, youtube: 7 } as Record<string, number>,
    status: ["High Novelty"],
    velocity: 12.3
  },
  {
    id: "4",
    name: "Digital Detox Retreats",
    category: "lifestyle",
    seerScore: 76,
    leadTime: "20 days",
    momentum: [15, 18, 21, 24, 28, 32, 37, 42],
    evidence: { reddit: 22, instagram: 15, youtube: 8 } as Record<string, number>,
    status: ["Low Saturation", "Cross-Platform"],
    velocity: 6.8
  },
  {
    id: "5",
    name: "Minimalist Phone Cases",
    category: "tech",
    seerScore: 92,
    leadTime: "12 days",
    momentum: [45, 48, 52, 58, 65, 72, 78, 81],
    evidence: { reddit: 12, tiktok: 6, youtube: 3 } as Record<string, number>,
    status: ["Low Saturation", "High Novelty"],
    velocity: 15.2
  }
];

export default function TrendGrid({ selectedCategories }: TrendGridProps) {
  const [hoveredTrend, setHoveredTrend] = useState<string | null>(null);
  
  // Filter trends based on selected categories
  const filteredTrends = mockTrends.filter(trend => 
    selectedCategories.length === 0 || selectedCategories.includes(trend.category)
  );

  return (
    <div className="space-y-8">
      {/* Section Header with better styling */}
      <div className="flex items-end justify-between border-b border-temple/20 dark:border-earthy-umber/30 pb-6">
        <div>
          <h2 className="text-4xl font-extralight text-night dark:text-snow tracking-tight">
            Top Emerging Trends
          </h2>
          <p className="text-sm text-cashew dark:text-temple font-light mt-2 tracking-wide">
            Sorted by Seer Score • Your categories
          </p>
        </div>
        
        {/* View controls with luxury styling */}
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-xs text-cashew dark:text-temple 
                           hover:bg-frozen/30 dark:hover:bg-earthy-umber/30 
                           rounded-full transition-all uppercase tracking-wider font-light">
            Filter
          </button>
          <button className="px-4 py-2 text-xs text-cashew dark:text-temple 
                           hover:bg-frozen/30 dark:hover:bg-earthy-umber/30 
                           rounded-full transition-all uppercase tracking-wider font-light">
            Export
          </button>
        </div>
      </div>

      {/* Dynamic Asymmetric Grid Layout */}
      <div className="grid grid-cols-4 gap-6 auto-rows-[280px]">
        {filteredTrends.map((trend, index) => {
          // First item spans 2x2
          const isFirst = index === 0;
          // Third item spans 2 columns
          const isThird = index === 2;
          
          return (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                ${isFirst ? 'col-span-2 row-span-2' : ''}
                ${isThird ? 'col-span-2' : ''}
                ${!isFirst && !isThird ? 'col-span-1' : ''}
              `}
              onMouseEnter={() => setHoveredTrend(trend.id)}
              onMouseLeave={() => setHoveredTrend(null)}
            >
              <TrendTile 
                trend={trend} 
                isHovered={hoveredTrend === trend.id}
                variant={isFirst ? 'large' : 'default'}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Action Area with luxury feel */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-between items-center pt-8 border-t border-temple/10 dark:border-earthy-umber/20"
      >
        <div className="flex items-center gap-6">
          <span className="text-xs text-cashew dark:text-temple uppercase tracking-[0.2em]">
            Showing {filteredTrends.length} of 24 trends
          </span>
          <div className="flex gap-2">
            {[1, 2, 3].map(page => (
              <button
                key={page}
                className={`w-8 h-8 rounded-full text-xs font-light transition-all
                          ${page === 1 
                            ? 'bg-night dark:bg-frozen text-snow dark:text-night' 
                            : 'text-cashew dark:text-temple hover:bg-frozen/30 dark:hover:bg-earthy-umber/30'}`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
        
        <button className="group flex items-center gap-2 text-sm text-cashew dark:text-temple 
                         hover:text-night dark:hover:text-snow transition-colors">
          <span className="font-light tracking-wide">View all trends</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </motion.div>
    </div>
  );
}