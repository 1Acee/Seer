// components/onboarding/CategoryStep.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const CATEGORIES = [
  { id: "beauty", label: "Beauty", icon: "✦", color: "rose" },
  { id: "fashion", label: "Fashion", icon: "◈", color: "amber" },
  { id: "food", label: "Food", icon: "❋", color: "orange" },
  { id: "fitness", label: "Fitness", icon: "▲", color: "emerald" },
  { id: "tech", label: "Tech", icon: "◆", color: "blue" },
  { id: "finance", label: "Finance", icon: "◉", color: "indigo" },
  { id: "lifestyle", label: "Lifestyle", icon: "❖", color: "purple" },
  { id: "gaming", label: "Gaming", icon: "▶", color: "violet" },
  { id: "music", label: "Music", icon: "♫", color: "pink" },
  { id: "home", label: "Home", icon: "⌂", color: "stone" },
  { id: "photo", label: "Photo", icon: "◐", color: "cyan" },
  { id: "auto", label: "Auto", icon: "◓", color: "slate" },
  { id: "travel", label: "Travel", icon: "✈", color: "sky" },
  { id: "education", label: "Education", icon: "◔", color: "teal" }
];

interface CategoryStepProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  onComplete: () => void;
}

export default function CategoryStep({ selectedCategories, onCategoriesChange, onComplete }: CategoryStepProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleCategoryToggle = (categoryId: string) => {
    let newSelection = [...selectedCategories];
    
    if (newSelection.includes(categoryId)) {
      newSelection = newSelection.filter(id => id !== categoryId);
    } else if (newSelection.length < 5) {
      newSelection.push(categoryId);
    }
    
    onCategoriesChange(newSelection);
  };

  const canProceed = selectedCategories.length >= 3 && selectedCategories.length <= 5;

  const getCategoryStyles = (color: string, isSelected: boolean, isHovered: boolean) => {
    if (isSelected) {
      return 'bg-violet-50 border-2 border-violet-400 shadow-lg';
    }
    if (isHovered) {
      return 'bg-stone-50 border-2 border-stone-300 shadow-md';
    }
    return 'bg-gradient-to-br from-stone-100 to-stone-50 border border-stone-200 hover:border-stone-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f1ed] via-[#ede8e3] to-[#e8e2db] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extralight text-stone-800 mb-4">
            Choose your interests
          </h1>
          <p className="text-stone-600 font-light max-w-2xl mx-auto mb-8">
            Select 3 to 5 categories to personalize your trend intelligence
          </p>
          
          {/* Animated selection indicator */}
          <motion.div 
            className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-full border border-stone-200 shadow-sm"
            animate={{ 
              borderColor: selectedCategories.length >= 3 ? '#c084fc' : '#e7e5e4',
              boxShadow: selectedCategories.length >= 3 
                ? '0 10px 15px -3px rgba(139, 92, 246, 0.1)' 
                : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    backgroundColor: selectedCategories.length > i ? '#8b5cf6' : '#e7e5e4',
                    scale: selectedCategories.length > i ? [1, 1.3, 1] : 1,
                  }}
                  transition={{ 
                    backgroundColor: { duration: 0.2 },
                    scale: { duration: 0.3 }
                  }}
                  className="w-2.5 h-2.5 rounded-full"
                />
              ))}
            </div>
            <motion.span 
              key={selectedCategories.length}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-stone-700 font-light"
            >
              {selectedCategories.length === 0 
                ? 'Select at least 3'
                : selectedCategories.length < 3
                ? `${3 - selectedCategories.length} more needed`
                : selectedCategories.length === 5
                ? 'Perfect selection!'
                : `${selectedCategories.length} selected`
              }
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Categories Grid - Larger cards with animations */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-14">
          {CATEGORIES.map((category, index) => {
            const isSelected = selectedCategories.includes(category.id);
            const isHovered = hoveredCategory === category.id;
            const isDisabled = !isSelected && selectedCategories.length >= 5;
            
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.03, 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 150
                }}
                onClick={() => !isDisabled && handleCategoryToggle(category.id)}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                disabled={isDisabled}
                whileHover={!isDisabled ? { 
                  y: -4,
                  scale: 1.05,
                  transition: { duration: 0.2 }
                } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                className={`
                  relative aspect-square p-5 rounded-2xl transition-all duration-200 overflow-hidden
                  ${getCategoryStyles(category.color, isSelected, isHovered)}
                  ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {/* Animated background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-violet-500/10 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isSelected ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Icon with animation and color change on hover */}
                <motion.div 
                  className={`
                    text-2xl mb-3 transition-all duration-300 relative
                    ${isSelected 
                      ? 'text-violet-600 drop-shadow-md' 
                      : isDisabled 
                      ? 'text-stone-400' 
                      : isHovered
                      ? 'text-violet-500 drop-shadow-sm scale-110'
                      : 'text-stone-600'}
                  `}
                  animate={{ 
                    rotate: isSelected ? [0, 360] : 0,
                    scale: isHovered && !isDisabled ? 1.2 : 1
                  }}
                  transition={{ 
                    rotate: { duration: 0.5 },
                    scale: { duration: 0.2 }
                  }}
                >
                  {category.icon}
                </motion.div>
                
                {/* Label */}
                <span className={`
                  text-xs font-medium transition-colors relative
                  ${isSelected ? 'text-violet-700' : isDisabled ? 'text-stone-400' : 'text-stone-700'}
                `}>
                  {category.label}
                </span>

                {/* Hover effect shimmer */}
                {isHovered && !isDisabled && !isSelected && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                )}

                {/* Selection checkmark - animated */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center shadow-md"
                    >
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Continue Button - Animated */}
        <AnimatePresence mode="wait">
          {canProceed && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-center"
            >
              <motion.button
                onClick={onComplete}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-14 py-4 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-full font-light text-lg transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                <span className="flex items-center gap-3">
                  Continue to dashboard
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}