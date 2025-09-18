// File: components/onboarding/CategoryStep.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { id: "beauty", label: "Beauty", symbol: "◐" },
  { id: "fashion", label: "Fashion", symbol: "◑" },
  { id: "food", label: "Food & Beverage", symbol: "◒" },
  { id: "fitness", label: "Fitness", symbol: "◓" },
  { id: "tech", label: "Technology", symbol: "◔" },
  { id: "finance", label: "Finance", symbol: "◕" },
  { id: "lifestyle", label: "Lifestyle", symbol: "◖" },
  { id: "gaming", label: "Gaming", symbol: "◗" },
  { id: "music", label: "Music", symbol: "◘" },
  { id: "home", label: "Home & DIY", symbol: "◙" },
  { id: "photography", label: "Photography", symbol: "◚" },
  { id: "automotive", label: "Automotive", symbol: "◛" },
  { id: "travel", label: "Travel", symbol: "◜" },
  { id: "education", label: "Education", symbol: "◝" }
];

interface CategoryStepProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  onComplete: () => void;
}

export default function CategoryStep({ selectedCategories, onCategoriesChange, onComplete }: CategoryStepProps) {
  const [showContinue, setShowContinue] = useState(false);

  const handleCategoryToggle = (categoryId: string) => {
    let newSelection = [...selectedCategories];
    
    if (newSelection.includes(categoryId)) {
      newSelection = newSelection.filter(id => id !== categoryId);
    } else if (newSelection.length < 5) {
      newSelection.push(categoryId);
    }
    
    onCategoriesChange(newSelection);
    
    if (newSelection.length >= 3 && newSelection.length <= 5) {
      setShowContinue(true);
    } else {
      setShowContinue(false);
    }
  };

  const canProceed = selectedCategories.length >= 3 && selectedCategories.length <= 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-75 to-stone-100 flex items-center justify-center p-12">
      <div className="w-full max-w-6xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-7xl md:text-8xl font-extralight text-stone-900 mb-6 tracking-tight leading-none">
            What calls to <span className="font-light italic">you</span>?
          </h1>
          <p className="text-xl text-stone-500 max-w-4xl mx-auto leading-relaxed font-light mb-8">
            Select 3–5 domains where you seek intelligence. 
            <br />We'll surface the most significant patterns within your chosen spheres.
          </p>
          
          {/* Refined selection counter */}
          <motion.div 
            className="inline-flex items-center gap-6 px-8 py-4 bg-white/60 backdrop-blur-sm rounded-full border border-stone-200/50 shadow-lg"
            animate={{ scale: selectedCategories.length > 0 ? 1.02 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <motion.div
                  key={num}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    selectedCategories.length >= num 
                      ? 'bg-stone-900' 
                      : 'bg-stone-300'
                  }`}
                  animate={selectedCategories.length >= num ? {
                    scale: [1, 1.3, 1],
                  } : {}}
                  transition={{ duration: 0.4, delay: 0.1 }}
                />
              ))}
            </div>
            <div className="h-4 w-px bg-stone-300"></div>
            <span className="text-sm font-light text-stone-600">
              {selectedCategories.length < 3 
                ? `${3 - selectedCategories.length} more required`
                : selectedCategories.length === 5
                ? "Selection complete"
                : `${selectedCategories.length} domains chosen`
              }
            </span>
          </motion.div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center mt-12">
            <div className="flex space-x-3">
              <div className="w-2 h-2 bg-stone-400 rounded-full opacity-60"></div>
              <div className="w-2 h-2 bg-stone-400 rounded-full opacity-60"></div>
              <div className="w-12 h-2 bg-stone-900 rounded-full"></div>
            </div>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-16">
          {CATEGORIES.map((category, index) => {
            const isSelected = selectedCategories.includes(category.id);
            const isDisabled = !isSelected && selectedCategories.length >= 5;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.05, 
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="group"
              >
                <motion.button
                  whileHover={!isDisabled ? { 
                    y: -8, 
                    scale: 1.05,
                    transition: { duration: 0.2 } 
                  } : {}}
                  whileTap={!isDisabled ? { scale: 0.95 } : {}}
                  onClick={() => !isDisabled && handleCategoryToggle(category.id)}
                  disabled={isDisabled}
                  className={`relative w-full aspect-square rounded-3xl p-6 transition-all duration-400 overflow-hidden ${
                    isSelected 
                      ? 'bg-white shadow-2xl ring-1 ring-stone-900/10' 
                      : isDisabled
                      ? 'bg-stone-100/30 opacity-30 cursor-not-allowed'
                      : 'bg-stone-50/50 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-white/80'
                  }`}
                  style={{
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(250,248,246,0.9))' 
                      : undefined
                  }}
                >
                  {/* Neon accent line for selected */}
                  {isSelected && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute top-0 left-0 right-0 h-px"
    style={{ background: 'linear-gradient(90deg, transparent, rgb(255, 107, 107), transparent)' }}
  />
)}
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center text-center">
                    
                    {/* Symbol */}
                    <motion.div 
                      className={`text-3xl mb-4 font-light transition-all duration-300 ${
                        isSelected 
                          ? 'text-stone-900 scale-110' 
                          : isDisabled
                          ? 'text-stone-300'
                          : 'text-stone-400 group-hover:text-stone-600'
                      }`}
                      animate={isSelected ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      {category.symbol}
                    </motion.div>
                    
                    {/* Label */}
                    <span className={`text-xs font-light transition-colors duration-300 leading-tight ${
                      isSelected 
                        ? 'text-stone-900' 
                        : isDisabled
                        ? 'text-stone-400'
                        : 'text-stone-500 group-hover:text-stone-700'
                    }`}>
                      {category.label}
                    </span>
                  </div>
                  
                  {/* Selection indicator */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.4 }}
                        className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
      style={{ background: 'rgb(255, 107, 107)' }}
    >
      <div className="w-2 h-2 bg-stone-900 rounded-full"></div>
    </motion.div>
  )}
</AnimatePresence>
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Button */}
        <AnimatePresence>
          {showContinue && canProceed && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center"
            >
              <motion.button
                onClick={onComplete}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-4 px-12 py-5 bg-stone-900 hover:bg-stone-800 text-white rounded-full font-light text-lg transition-all duration-400 shadow-2xl hover:shadow-3xl"
              >
                <span>Complete your setup</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                
                {/* Subtle glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px bg-stone-300 rounded-full"
              style={{
                left: `${10 + i * 7}%`,
                top: `${20 + (i % 5) * 15}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 3 + i * 0.3,
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