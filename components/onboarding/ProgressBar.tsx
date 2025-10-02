// components/onboarding/ProgressBar.tsx
"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: string;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const steps = [
    { id: 'account', label: 'Account', number: 1 },
    { id: 'persona', label: 'Profile', number: 2 },
    { id: 'categories', label: 'Interests', number: 3 },
    { id: 'complete', label: 'Complete', number: 4 }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  if (currentStep === 'complete') return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      {/* Subtle background with blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-100/95 to-stone-100/80 backdrop-blur-md" />
      
      <div className="relative max-w-4xl mx-auto px-8 pt-8 pb-6">
        {/* Step dots with connecting line */}
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => {
            const isActive = index <= currentStepIndex;
            const isCurrent = step.id === currentStep;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="relative">
                  {/* Step dot */}
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.2 : 1,
                      backgroundColor: isActive ? 'rgb(139, 92, 246)' : 'rgb(231, 229, 228)'
                    }}
                    transition={{ duration: 0.3 }}
                    className={`w-2 h-2 rounded-full relative z-10`}
                  />
                  
                  {/* Step label - only for current step */}
                  {isCurrent && (
                    <motion.span
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-stone-600 font-light whitespace-nowrap"
                    >
                      {step.label}
                    </motion.span>
                  )}
                </div>
                
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-stone-200 mx-2 relative">
                    <motion.div
                      className="absolute inset-0 h-full bg-gradient-to-r from-violet-500 to-violet-400"
                      initial={{ width: '0%' }}
                      animate={{ 
                        width: index < currentStepIndex ? '100%' : '0%'
                      }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}