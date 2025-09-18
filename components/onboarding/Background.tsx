// File: components/onboarding/Background.tsx
"use client";

import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="fixed inset-0">
      {/* Simple base gradient */}
      <div 
        className="absolute inset-0" 
        style={{ 
          background: 'radial-gradient(ellipse at center, #faf8f6 0%, #f5f1ed 25%, #e8e2db 50%, #fdfcfb 100%)'
        }} 
      />
    </div>
  );
}