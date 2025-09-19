'use client';

import { motion, Variants } from 'framer-motion';
import TrendCard from './TrendCard';
import { TrendData } from '@/utils/mockTrendsData';

interface TrendsGridProps {
  trends: TrendData[];
  viewMode: 'grid' | 'list';
  onTrendClick: (trend: TrendData) => void;
}

export default function TrendsGrid({ trends, viewMode, onTrendClick }: TrendsGridProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6'
        : 'space-y-4'
      }
    >
      {trends.map(trend => (
        <motion.div
          key={trend.id}
          variants={itemVariants}
          layout
          layoutId={trend.id}
        >
          <TrendCard
            trend={trend}
            viewMode={viewMode}
            onClick={() => onTrendClick(trend)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}