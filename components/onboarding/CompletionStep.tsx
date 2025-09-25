// File: components/onboarding/CompletionStep.tsx
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Sparkles } from "lucide-react";
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
    // Stagger the content reveal
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleContinueToDashboard = () => {
    // Save completion state
    localStorage.setItem("onboardingComplete", "true");
    localStorage.setItem("userData", JSON.stringify({
      userName,
      selectedPersona, 
      selectedCategories,
      completedAt: new Date().toISOString()
    }));
    
    // Navigate to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 flex items-center justify-center p-8">
      <div className="w-full max-w-3xl text-center">
        
        {/* Animated Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="relative inline-block mb-12"
        >
          <div className="w-32 h-32 bg-stone-900 rounded-full flex items-center justify-center shadow-2xl">
            <Check className="w-16 h-16 text-white" />
          </div>
          
          {/* Orbiting sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
    style={{ 
      background: 'rgb(255, 107, 107)',
      left: '50%',
      top: '50%' 
    }}
              animate={{
                x: Math.cos(i * 1.047) * 80,
                y: Math.sin(i * 1.047) * 80,
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
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
          <h1 className="text-6xl md:text-7xl font-light text-stone-900 mb-6 tracking-tight">
            You're <span className="font-medium">ready</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-2xl text-stone-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            Your intelligence system is calibrated, {userName.split(' ')[0]}
          </p>
          
          {/* Description */}
          <p className="text-lg text-stone-500 mb-12 max-w-xl mx-auto leading-relaxed">
            We're already tracking emerging patterns across your selected domains. 
            The future is about to reveal itself.
          </p>
        </motion.div>

        {/* Setup Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-stone-200/50 shadow-xl"
        >
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">
                Your Role
              </h3>
              <p className="text-lg text-stone-900 capitalize">
                {selectedPersona.replace('-', ' ')}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">
                Focus Areas
              </h3>
              <p className="text-lg text-stone-900">
                {selectedCategories.length} domains selected
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.8 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            onClick={handleContinueToDashboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-4 px-12 py-6 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xl font-medium transition-all duration-300 shadow-2xl hover:shadow-3xl"
          >
            <span>Enter your dashboard</span>
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </motion.div>

        {/* Subtle footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-sm text-stone-400 mt-12"
        >
          Intelligence flows where attention goes
        </motion.p>

        {/* Ambient floating elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-stone-300 rounded-full"
              style={{
                left: `${10 + i * 7}%`,
                top: `${20 + (i % 5) * 15}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 4 + i * 0.3,
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