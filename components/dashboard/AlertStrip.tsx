// File: components/dashboard/AlertStrip.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface AlertStripProps {
  alerts: string[];
}

export default function AlertStrip({ alerts }: AlertStripProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || alerts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-card/80 backdrop-blur-sm 
                   border-b border-border transition-colors"
      >
        <div className="px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Alert icon */}
            <span className="text-2xl" style={{ color: 'var(--accent-color)' }}>◎</span>
            
            {/* Alert messages */}
            <div className="flex items-center gap-6">
              <span className="text-sm text-muted-foreground font-light transition-colors">
                Since your last visit:
              </span>
              {alerts.map((alert, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="text-sm text-foreground font-light transition-colors"
                >
                  {alert}
                  {index < alerts.length - 1 && (
                    <span className="mx-3 text-muted-foreground">•</span>
                  )}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Dismiss button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-secondary-foreground transition-colors"
          >
            <span className="text-lg">×</span>
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}