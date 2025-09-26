// File: components/trends/SwipeModeWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import { TrendData } from '@/utils/mockTrendsData';

// Dynamically import SwipeMode with no SSR to prevent hydration errors
const SwipeMode = dynamic(() => import('./SwipeMode'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <p className="text-muted-foreground">Loading trends...</p>
      </div>
    </div>
  )
});

interface SwipeModeWrapperProps {
  trends: TrendData[];
  onClose: () => void;
}

export default function SwipeModeWrapper({ trends, onClose }: SwipeModeWrapperProps) {
  return <SwipeMode trends={trends} onClose={onClose} />;
}