// components/onboarding/PersonaStep.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const PERSONAS = [
  {
    id: "content-creator",
    title: "Content Creator",
    subtitle: "TikTok • Reels • YouTube",
    description: "Track viral trends and optimize content timing",
    icon: "◉",
    accent: "violet",
    details: [
      "Viral content predictions",
      "Hashtag optimization", 
      "Best posting times"
    ]
  },
  {
    id: "marketing-agency", 
    title: "Marketing Agency",
    subtitle: "Multi-client campaigns",
    description: "Monitor market shifts and campaign performance",
    icon: "◈",
    accent: "indigo",
    details: [
      "Campaign analytics",
      "Competitor tracking",
      "Client reporting tools"
    ]
  },
  {
    id: "pr-specialist",
    title: "PR Specialist", 
    subtitle: "Brand reputation",
    description: "Track sentiment and media opportunities",
    icon: "◆",
    accent: "blue",
    details: [
      "Crisis detection",
      "Media monitoring",
      "Sentiment analysis"
    ]
  },
  {
    id: "talent-manager",
    title: "Talent Manager",
    subtitle: "Creator representation",
    description: "Identify growth opportunities for clients",
    icon: "◊",
    accent: "purple",
    details: [
      "Talent positioning",
      "Growth strategies",
      "Brand partnerships"
    ]
  },
  {
    id: "entrepreneur",
    title: "Entrepreneur",
    subtitle: "Product innovation",
    description: "Discover market gaps and validate ideas",
    icon: "△",
    accent: "fuchsia",
    details: [
      "Market validation",
      "Trend forecasting",
      "Opportunity scoring"
    ]
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
    setTimeout(() => onPersonaSelect(personaId), 600);
  };

  const getAccentColor = (accent: string, type: 'bg' | 'border' | 'text' | 'light') => {
    const colors = {
      violet: {
        bg: 'bg-violet-50',
        border: 'border-violet-200',
        text: 'text-violet-600',
        light: 'bg-violet-100'
      },
      indigo: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        text: 'text-indigo-600',
        light: 'bg-indigo-100'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-600',
        light: 'bg-blue-100'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-600',
        light: 'bg-purple-100'
      },
      fuchsia: {
        bg: 'bg-fuchsia-50',
        border: 'border-fuchsia-200',
        text: 'text-fuchsia-600',
        light: 'bg-fuchsia-100'
      }
    };
    return colors[accent as keyof typeof colors][type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f1ed] via-[#ede8e3] to-[#e8e2db] pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extralight text-stone-800 mb-4">
            Select your role
          </h1>
          <p className="text-stone-600 font-light max-w-2xl mx-auto">
            Choose the profile that best describes your work. This helps us customize your experience.
          </p>
        </motion.div>

        {/* Persona Grid - Larger cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 max-w-7xl mx-auto">
          {PERSONAS.map((persona, index) => {
            const isSelected = selectedPersona === persona.id;
            const isHovered = hoveredPersona === persona.id;
            
            return (
              <motion.button
                key={persona.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.08, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -6,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handlePersonaClick(persona.id)}
                onMouseEnter={() => setHoveredPersona(persona.id)}
                onMouseLeave={() => setHoveredPersona(null)}
                className="relative group text-left"
              >
                <motion.div
                  layoutId={`persona-card-${persona.id}`}
                  className={`
                    relative h-full p-7 rounded-2xl transition-all duration-300 overflow-hidden
                    ${isSelected 
                      ? `${getAccentColor(persona.accent, 'light')} ${getAccentColor(persona.accent, 'border')} border-2 shadow-xl` 
                      : 'bg-white border border-stone-200 hover:border-stone-300 hover:shadow-lg'
                    }
                  `}
                >
                  {/* Animated background gradient on hover */}
                  <motion.div
                    className={`absolute inset-0 ${getAccentColor(persona.accent, 'bg')} opacity-0`}
                    animate={{ opacity: isHovered ? 0.3 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Icon with animation */}
                  <motion.div 
                    className={`
                      relative text-3xl mb-5 transition-colors duration-300
                      ${isSelected ? getAccentColor(persona.accent, 'text') : 'text-stone-400'}
                    `}
                    animate={{ 
                      rotate: isSelected ? 360 : 0,
                      scale: isHovered ? 1.1 : 1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {persona.icon}
                  </motion.div>

                  {/* Content */}
                  <div className="relative space-y-3">
                    <h3 className={`font-medium text-lg transition-colors ${
                      isSelected ? 'text-stone-900' : 'text-stone-700'
                    }`}>
                      {persona.title}
                    </h3>
                    
                    <p className={`text-xs font-light transition-colors ${
                      isSelected ? 'text-stone-700' : 'text-stone-500'
                    }`}>
                      {persona.subtitle}
                    </p>
                    
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isSelected ? 'text-stone-700' : 'text-stone-600'
                    }`}>
                      {persona.description}
                    </p>

                    {/* Details on hover - simple fade in */}
                    <AnimatePresence>
                      {(isHovered || isSelected) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pt-3 border-t border-stone-200"
                        >
                          <div className="space-y-1">
                            {persona.details.map((detail, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center gap-2 text-xs text-stone-600"
                              >
                                <span className={`w-1 h-1 rounded-full ${getAccentColor(persona.accent, 'bg')}`} />
                                {detail}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Selection indicator - animated */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className={`absolute -top-2 -right-2 w-7 h-7 ${getAccentColor(persona.accent, 'light')} ${getAccentColor(persona.accent, 'border')} border-2 rounded-full flex items-center justify-center`}
                      >
                        <svg className={`w-4 h-4 ${getAccentColor(persona.accent, 'text')}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {/* Helper text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-stone-500 mt-10 font-light"
        >
          You can change this later in settings
        </motion.p>
      </div>
    </div>
  );
}