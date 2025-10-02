// components/onboarding/CompletionStep.tsx
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CompletionStepProps {
  userName: string;
  selectedPersona: string;
  selectedCategories: string[];
}

export default function CompletionStep({ userName, selectedPersona, selectedCategories }: CompletionStepProps) {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleContinueToDashboard = () => {
    localStorage.setItem("onboardingComplete", "true");
    localStorage.setItem("userData", JSON.stringify({
      userName,
      selectedPersona, 
      selectedCategories,
      completedAt: new Date().toISOString()
    }));
    
    router.push("/dashboard");
  };

  // Format persona name
  const formatPersona = (persona: string) => {
    return persona.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-warm-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl text-center">
        
        {/* Animated checkmark circle */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2,
            type: "spring",
            stiffness: 150,
            damping: 15
          }}
          className="relative inline-block mb-12"
        >
          {/* Main circle */}
          <div className="w-28 h-28 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center shadow-2xl">
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-14 h-14 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              />
            </motion.svg>
          </div>
          
          {/* Animated rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-violet-400"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ 
                scale: 1 + (i + 1) * 0.3,
                opacity: 0
              }}
              transition={{
                duration: 1.5,
                delay: 0.8 + i * 0.2,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ duration: 0.6 }}
        >
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-extralight text-stone-800 mb-6">
            Welcome to <span className="font-light italic text-violet-600">Seer</span>
          </h1>
          
          {/* Personalized greeting */}
          <p className="text-2xl text-stone-700 mb-4 font-light">
            {userName ? `Hello ${userName.split(' ')[0]}` : 'Your account'} is ready
          </p>
          
          {/* Description */}
          <p className="text-lg text-stone-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            We're already analyzing patterns across your selected domains. 
            Your personalized intelligence dashboard awaits.
          </p>
        </motion.div>

        {/* Setup Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-8 mb-12 border border-stone-200 shadow-lg max-w-2xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
                  <span className="text-violet-600 text-lg">◈</span>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Your Role
                  </h3>
                  <p className="text-lg text-stone-900 font-light">
                    {formatPersona(selectedPersona)}
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
                  <span className="text-violet-600 text-lg">◉</span>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Focus Areas
                  </h3>
                  <p className="text-lg text-stone-900 font-light">
                    {selectedCategories.length} categories selected
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Selected categories preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 pt-6 border-t border-stone-100"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedCategories.slice(0, 5).map((category, idx) => (
                <motion.span
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + idx * 0.05 }}
                  className="px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-sm font-light"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.9 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            onClick={handleContinueToDashboard}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-full text-lg font-light transition-all duration-300 shadow-2xl hover:shadow-3xl"
          >
            <span>Enter your dashboard</span>
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </motion.svg>
          </motion.button>
        </motion.div>

        {/* Subtle footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 0.5 : 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-sm text-stone-400 mt-12 font-light italic"
        >
          Intelligence begins now
        </motion.p>

        {/* Background decoration */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-violet-300 rounded-full"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 4) * 20}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}