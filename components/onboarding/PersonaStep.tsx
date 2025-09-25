// File: components/onboarding/PersonaStep.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Circle } from "lucide-react";
import { useState } from "react";

const PERSONAS = [
  {
    id: "content-creator",
    title: "Content Creator",
    description: "TikTok, Reels, YouTube Shorts creator looking for viral trends",
    symbol: "◯",
    features: ["Viral content ideas", "Trend timing", "Platform optimization"]
  },
  {
    id: "marketing-agency", 
    title: "Marketing Agency",
    description: "Full-service agency managing multiple client campaigns",
    symbol: "◢",
    features: ["Client reporting", "Campaign insights", "Market analysis"]
  },
  {
    id: "pr-specialist",
    title: "PR Specialist", 
    description: "Public relations professional tracking brand sentiment",
    symbol: "◆",
    features: ["Brand monitoring", "Crisis prevention", "Media opportunities"]
  },
  {
    id: "talent-manager",
    title: "Talent Manager",
    description: "Agent representing creators and managing their growth",
    symbol: "◈",
    features: ["Talent positioning", "Growth strategies", "Market opportunities"]
  },
  {
    id: "entrepreneur",
    title: "Entrepreneur",
    description: "Founder building products and identifying market opportunities",
    symbol: "△",
    features: ["Market validation", "Product opportunities", "Competitive analysis"]
  }
];

interface PersonaStepProps {
  onPersonaSelect: (personaId: string) => void;
}

export default function PersonaStep({ onPersonaSelect }: PersonaStepProps) {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [hoveredPersona, setHoveredPersona] = useState<string | null>(null);

  const handlePersonaClick = (personaId: string) => {
    setSelectedPersona(personaId);
    setTimeout(() => onPersonaSelect(personaId), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-75 to-stone-100 flex items-center justify-center p-12">
      <div className="w-full max-w-7xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h1 className="text-7xl md:text-8xl font-extralight text-stone-900 mb-6 tracking-tight leading-none">
            Who are <span className="font-light italic">you</span>?
          </h1>
          <p className="text-xl text-stone-500 max-w-3xl mx-auto leading-relaxed font-light">
            Choose your creative identity to receive intelligence patterns 
            <br />designed for your unique workflow
          </p>
          
          {/* Minimal progress */}
          <div className="flex items-center justify-center mt-12">
            <div className="flex space-x-3">
              <div className="w-2 h-2 bg-stone-400 rounded-full opacity-60"></div>
              <div className="w-12 h-2 bg-stone-900 rounded-full"></div>
              <div className="w-2 h-2 bg-stone-300 rounded-full opacity-40"></div>
            </div>
          </div>
        </motion.div>

        {/* Persona Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {PERSONAS.map((persona, index) => {
            const isSelected = selectedPersona === persona.id;
            const isHovered = hoveredPersona === persona.id;
            
            return (
              <motion.div
                key={persona.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.15, 
                  duration: 0.7,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredPersona(persona.id)}
                onMouseLeave={() => setHoveredPersona(null)}
                onClick={() => handlePersonaClick(persona.id)}
              >
                <motion.div
                  whileHover={{ y: -12, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`relative h-96 rounded-3xl transition-all duration-500 overflow-hidden ${
                    isSelected 
                      ? 'bg-white shadow-2xl ring-1 ring-stone-900/10' 
                      : isHovered 
                      ? 'bg-white shadow-xl' 
                      : 'bg-stone-50/50 backdrop-blur-sm shadow-lg hover:shadow-xl'
                  }`}
                  style={{
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(250,248,246,0.9))' 
                      : undefined
                  }}
                >
                  
                  {/* Subtle neon accent line */}
                  {(isSelected || isHovered) && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute inset-0"
    style={{ background: 'linear-gradient(to bottom, rgba(var(--accent-rgb), 0.05), transparent)' }}
                    />
                  )}
                  
                  {/* Content */}
                  <div className="relative p-8 h-full flex flex-col">
                    
                    {/* Symbol */}
                    <div className="flex items-center justify-between mb-8">
                      <motion.div 
                        className={`text-4xl font-light transition-all duration-300 ${
                          isSelected 
                            ? 'text-stone-900 scale-110' 
                            : 'text-stone-400 group-hover:text-stone-600'
                        }`}
                        animate={isSelected ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        {persona.symbol}
                      </motion.div>
                      
                      {/* Selection indicator */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: isSelected ? 1 : 0,
                          opacity: isSelected ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-6 h-6 bg-lime-400 rounded-full flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-stone-900 rounded-full"></div>
                      </motion.div>
                    </div>

                    {/* Title and description */}
                    <div className="flex-grow">
                      <h3 className={`text-2xl font-light mb-4 transition-colors duration-300 ${
                        isSelected ? 'text-stone-900' : 'text-stone-700'
                      }`}>
                        {persona.title}
                      </h3>
                      <p className="text-stone-500 leading-relaxed mb-8 font-light text-sm">
                        {persona.description}
                      </p>
                    </div>

                    {/* Features - only show on hover or selection */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: isHovered || isSelected ? 1 : 0,
                        y: isHovered || isSelected ? 0 : 20
                      }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      {persona.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: isHovered || isSelected ? 1 : 0,
                            x: isHovered || isSelected ? 0 : -10
                          }}
                          transition={{ delay: idx * 0.1, duration: 0.3 }}
                          className="flex items-center text-xs text-stone-400 font-light"
                        >
                          <div className="w-1 h-1 bg-stone-300 rounded-full mr-3" />
                          {feature}
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Call to action overlay */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: isHovered && !isSelected ? 1 : 0,
                        y: isHovered && !isSelected ? 0 : 20
                      }}
                      className="absolute bottom-6 left-8 right-8"
                    >
                      <div className="bg-stone-900/90 backdrop-blur-sm text-white text-center py-3 rounded-2xl text-sm font-light">
                        Select this identity
                      </div>
                    </motion.div>
                  </div>

                  {/* Selection state overlay */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0"
    style={{ background: 'linear-gradient(to bottom, rgba(var(--accent-rgb), 0.05), transparent)' }} 
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full p-4 shadow-xl"
                      >
                        <ArrowRight className="w-6 h-6 text-stone-900" />
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Ambient elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px bg-stone-300 rounded-full"
              style={{
                left: `${15 + i * 10}%`,
                top: `${25 + (i % 3) * 20}%`,
              }}
              animate={{
                scale: [1, 3, 1],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + i * 0.5,
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