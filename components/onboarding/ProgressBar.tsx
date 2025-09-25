// File: components/onboarding/ProgressBar.tsx
"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: string;
  show: boolean;
}

export default function ProgressBar({ currentStep, show }: ProgressBarProps) {
  const progressPercentage: Record<string, number> = {
    account: 0,
    persona: 33,
    categories: 67,
    complete: 100
  };

  if (!show) return null;

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 w-[600px] h-1 rounded-full z-50" 
         style={{ backgroundColor: 'color-mix(in srgb, var(--border) 30%, transparent)' }}>
      <motion.div
        className="h-full rounded-full relative overflow-hidden"
        className="bg-accent"
        initial={{ width: "0%" }}
        animate={{ width: `${progressPercentage[currentStep]}%` }}
        transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
      >
        <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />
      </motion.div>
    </div>
  );
}