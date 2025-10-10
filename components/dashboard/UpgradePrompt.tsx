// components/dashboard/UpgradePrompt.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingUp, Lock } from "lucide-react";
import Link from "next/link";

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  message?: string;
  currentPlan?: string;
}

export default function UpgradePrompt({
  isOpen,
  onClose,
  feature = "This feature",
  message = "Upgrade to Pro to unlock advanced features and unlimited access.",
  currentPlan = "free"
}: UpgradePromptProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-md bg-card rounded-3xl overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div 
              className="p-8 text-white relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--accent-color) 100%)' }}
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/20" />
                <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-white/10" />
              </div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-light mb-2">
                  {feature} is a Premium Feature
                </h3>
                <p className="text-white/90 text-sm">
                  {message}
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.1)' }}
                  >
                    <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent-color)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Advanced Analytics</p>
                    <p className="text-xs text-muted-foreground">90-day history & AI predictions</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.1)' }}
                  >
                    <Zap className="w-4 h-4" style={{ color: 'var(--accent-color)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Unlimited Access</p>
                    <p className="text-xs text-muted-foreground">All categories & features</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-secondary text-foreground hover:bg-muted transition-colors"
                >
                  Maybe Later
                </button>
                <Link
                  href="/dashboard/subscription"
                  className="flex-1 py-3 rounded-xl text-white text-center transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                >
                  View Plans
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}