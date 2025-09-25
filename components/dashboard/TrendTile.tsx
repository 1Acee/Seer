// File: components/dashboard/TrendTile.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface TrendData {
  id: string;
  name: string;
  category: string;
  seerScore: number;
  leadTime: string;
  momentum: number[];
  evidence: Record<string, number>;
  status: string[];
  velocity: number;
}

interface TrendTileProps {
  trend: TrendData;
  isHovered: boolean;
  variant?: 'default' | 'large';
}

export default function TrendTile({ trend, isHovered, variant = 'default' }: TrendTileProps) {
  const isLarge = variant === 'large';
  
  // Generate more sophisticated area chart path
  const generateAreaPath = () => {
    const width = isLarge ? 280 : 180;
    const height = isLarge ? 120 : 80;
    const points = trend.momentum.map((value, index) => {
      const x = (index / (trend.momentum.length - 1)) * width;
      const y = height - (value / 100) * height;
      return { x, y };
    });
    
    // Create smooth curve for line
    let linePath = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const xMid = (points[i - 1].x + points[i].x) / 2;
      const yMid = (points[i - 1].y + points[i].y) / 2;
      const cp1x = (xMid + points[i - 1].x) / 2;
      const cp2x = (xMid + points[i].x) / 2;
      linePath += ` Q ${cp1x},${points[i - 1].y} ${xMid},${yMid}`;
      linePath += ` Q ${cp2x},${points[i].y} ${points[i].x},${points[i].y}`;
    }
    
    // Create area path
    const areaPath = linePath + ` L ${width},${height} L 0,${height} Z`;
    
    return { linePath, areaPath, points, width, height };
  };

  const { linePath, areaPath, points, width, height } = generateAreaPath();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        relative overflow-hidden
        ${isLarge ? 'col-span-2 row-span-2' : ''}
        ${isLarge ? 'bg-gradient-to-br from-frozen via-card to-snow' : 'bg-card'}
        dark:bg-gradient-to-br dark:from-night dark:via-night dark:to-earthy-umber
        rounded-3xl ${isLarge ? 'p-8' : 'p-6'}
        border border-temple/10 dark:border-earthy-umber/20
        ${isHovered ? 'shadow-luxury-lg' : 'shadow-luxury'}
        transition-all duration-500
      `}
    >
      {/* Background Pattern - only for large cards */}
      {isLarge && (
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{
               backgroundImage: `radial-gradient(circle at 2px 2px, rgb(145, 133, 116) 1px, transparent 1px)`,
               backgroundSize: '32px 32px'
             }} 
        />
      )}

      {/* Header Section */}
      <div className={`flex justify-between items-start ${isLarge ? 'mb-8' : 'mb-6'}`}>
        <div className="flex-1">
          <h3 className={`${isLarge ? 'text-2xl' : 'text-lg'} font-light text-night dark:text-snow tracking-wide`}>
            {trend.name}
          </h3>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-block px-3 py-1.5 bg-cashew/10 dark:bg-temple/10 
                           rounded-full text-xs text-cashew dark:text-temple 
                           font-light tracking-wider uppercase">
              {trend.category}
            </span>
            <span className="text-xs text-temple dark:text-cashew">
              Peak in <span className="text-accent-muted font-medium">{trend.leadTime}</span>
            </span>
          </div>
        </div>
        
        {/* Score - larger and more prominent */}
        <div className="text-right">
          <div className={`${isLarge ? 'text-5xl' : 'text-3xl'} font-extralight text-night dark:text-frozen`}>
            {trend.seerScore}
          </div>
          <div className="text-[10px] text-cashew dark:text-temple uppercase tracking-[0.2em] mt-1">
            Score
          </div>
        </div>
      </div>

      {/* Large Visualization Area */}
      <div className={`${isLarge ? 'mb-8' : 'mb-6'} relative`}>
        <div className="absolute -inset-4 bg-gradient-to-r from-frozen/30 via-temple/10 to-frozen/30 
                        dark:from-earthy-umber/30 dark:via-temple/10 dark:to-earthy-umber/30 
                        rounded-2xl blur-xl" />
        <div className="relative bg-gradient-to-br from-snow/50 to-frozen/30 
                        dark:from-night/50 dark:to-earthy-umber/30 
                        rounded-2xl p-4 backdrop-blur-sm">
          <svg width={width} height={height} className="w-full">
            <defs>
              {/* Area gradient */}
              <linearGradient id={`area-${trend.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(186, 177, 174)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(186, 177, 174)" stopOpacity="0.05" />
              </linearGradient>
              {/* Line gradient */}
              <linearGradient id={`line-${trend.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(145, 133, 116)" stopOpacity="0.4" />
                <stop offset="50%" stopColor="rgb(218, 143, 143)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="rgb(145, 133, 116)" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map(y => (
              <line
                key={y}
                x1="0"
                y1={height * y}
                x2={width}
                y2={height * y}
                stroke="rgb(186, 177, 174)"
                strokeOpacity="0.1"
                strokeDasharray="4 4"
              />
            ))}
            
            {/* Area fill */}
            <path
              d={areaPath}
              fill={`url(#area-${trend.id})`}
            />
            
            {/* Main line */}
            <path
              d={linePath}
              fill="none"
              stroke={`url(#line-${trend.id})`}
              strokeWidth={isLarge ? "3" : "2"}
            />
            
            {/* Data points */}
            {isLarge && points.map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="3"
                fill="rgb(218, 143, 143)"
                opacity={i === points.length - 1 ? "1" : "0.3"}
              />
            ))}
            
            {/* End point highlight */}
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r={isLarge ? "5" : "4"}
              fill="rgb(218, 143, 143)"
              className="animate-pulse"
            />
          </svg>
          
          {/* Velocity indicator below chart */}
          <div className="flex justify-between items-center mt-3 px-2">
            <span className="text-xs text-cashew dark:text-temple">
              {trend.velocity > 0 ? '↗' : '↘'} {Math.abs(trend.velocity)}% velocity
            </span>
            <span className="text-xs text-temple dark:text-cashew">
              7 day trend
            </span>
          </div>
        </div>
      </div>

      {/* Evidence & Status Section - redesigned */}
      <div className={`grid ${isLarge ? 'grid-cols-2 gap-6' : 'grid-cols-1 gap-4'}`}>
        {/* Evidence */}
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-cashew dark:text-temple mb-3">
            Evidence Signals
          </h4>
          <div className="flex gap-4">
            {Object.entries(trend.evidence).slice(0, isLarge ? 4 : 3).map(([source, count]) => (
              <div key={source} className="flex flex-col items-center">
                <span className="text-lg text-temple dark:text-cashew mb-1">
                  {source === 'reddit' && '◈'}
                  {source === 'tiktok' && '◉'}
                  {source === 'youtube' && '◊'}
                  {source === 'instagram' && '◇'}
                </span>
                <span className="text-[11px] text-cashew dark:text-frozen font-light">{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Status Pills */}
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-cashew dark:text-temple mb-3">
            Status
          </h4>
          <div className="flex flex-wrap gap-2">
            {trend.status.map(stat => (
              <span 
                key={stat}
                className="px-3 py-1.5 bg-temple/10 dark:bg-cashew/10 rounded-full 
                         text-[11px] text-night dark:text-frozen font-light"
              >
                {stat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar - more prominent */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute bottom-0 left-0 right-0 p-6 
                   bg-gradient-to-t from-card via-card/95 to-transparent 
                   dark:from-night dark:via-night/95`}
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-cashew/10 hover:bg-cashew/20 
                             dark:bg-temple/10 dark:hover:bg-temple/20
                             rounded-full text-xs text-night dark:text-snow 
                             font-light tracking-wide uppercase transition-all">
              Follow
            </button>
            <button className="px-4 py-2 hover:bg-frozen/30 dark:hover:bg-earthy-umber/30
                             rounded-full text-xs text-cashew dark:text-temple 
                             font-light tracking-wide uppercase transition-all">
              Save
            </button>
          </div>
          <Link href={`/trends/${trend.id}`}>
            <motion.span 
              whileHover={{ x: 3 }}
              className="inline-flex items-center gap-2 px-4 py-2 
                       bg-accent-muted/10 hover:bg-accent-muted/20
                       rounded-full text-xs text-accent-muted 
                       font-light tracking-wide uppercase transition-all"
            >
              Analyze
              <span>→</span>
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}