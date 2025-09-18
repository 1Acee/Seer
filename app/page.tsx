"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse for subtle parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="w-screen h-screen overflow-hidden" style={{ background: '#fdfcfb' }}>
      {/* Clean background - no extra elements */}
      <div className="fixed inset-0">
        {/* Simple base gradient */}
        <div className="absolute inset-0" 
             style={{ 
               background: 'radial-gradient(ellipse at center, #faf8f6 0%, #f5f1ed 25%, #e8e2db 50%, #fdfcfb 100%)'
             }} />
      </div>

      {/* Main content - centered */}
      <div className="relative w-screen h-screen flex items-center justify-center">
        <div className="text-center">
          {/* Small logo above */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                 style={{ 
                   background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                   boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)'
                 }}>
              <TrendingUp className="w-8 h-8" style={{ color: '#fdfcfb' }} />
            </div>
          </motion.div>

          {/* Main Seer title */}
          <motion.h1 
            className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-light mb-8 leading-none"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#1c1917',
              letterSpacing: '-0.02em'
            }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            Seer
          </motion.h1>
          
          {/* Subtitle line */}
          <motion.div 
            className="flex items-center justify-center gap-8 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="h-[1px] w-32" style={{ background: 'linear-gradient(90deg, transparent, #d4cbc0)' }} />
            <span className="text-xl tracking-[0.5em] uppercase font-light" style={{ color: '#9a8d7d' }}>
              Intelligence Awaits
            </span>
            <div className="h-[1px] w-32" style={{ background: 'linear-gradient(90deg, #d4cbc0, transparent)' }} />
          </motion.div>

          {/* Description */}
          <motion.p 
            className="text-2xl md:text-3xl font-light leading-relaxed max-w-4xl mx-auto mb-16"
            style={{ color: '#7d7265' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Transform your creative vision with predictive trend intelligence. 
            Let's craft your personalized experience.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Link href="/onboarding">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative"
              >
                <div className="relative px-16 py-6 rounded-full overflow-hidden"
                     style={{ 
                       background: 'linear-gradient(135deg, #1c1917, #4a433b)',
                       boxShadow: '0 30px 60px rgba(28, 25, 23, 0.3)'
                     }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                       style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} />
                  <span className="relative flex items-center gap-4 text-xl font-light" style={{ color: '#fdfcfb' }}>
                    Begin Your Journey
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                  </span>
                </div>
              </motion.button>
            </Link>
          </motion.div>

          {/* Bottom accent */}
          <motion.div
            className="flex items-center justify-center gap-16 mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {['Personalized', 'Predictive', 'Powerful'].map((text, i) => (
              <div key={text} className="flex items-center gap-3">
                <motion.div 
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#6366f1' }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                />
                <span className="text-base" style={{ color: '#b8ab9b' }}>{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </main>
  );
}