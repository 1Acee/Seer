// File: components/dashboard/TopNav.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

export default function TopNav() {
  const { theme, toggleTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: "Quiet Luxury trend reaching critical mass", time: "2m", type: "trend" },
    { id: 2, text: "Your watchlist item 'Dopamine Decor' is heating up", time: "1h", type: "alert" },
    { id: 3, text: "Weekly intelligence report ready", time: "3h", type: "report" }
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 right-0 h-20 z-40 dark:bg-earthy-night/95"
      style={{ 
        left: '288px', // Accounts for 72*4 = 288px sidebar width
        background: theme === 'dark' ? 'rgba(23, 22, 20, 0.95)' : 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: theme === 'dark' ? '1px solid rgba(82, 70, 57, 0.5)' : '1px solid rgba(186, 177, 174, 0.2)'
      }}
    >
      <div className="h-full px-8 flex items-center justify-between">
        {/* Search Section - NO LONGER OVERLAPPING */}
        <div className="flex-1 max-w-2xl">
          <motion.div
            animate={{ width: showSearch ? '100%' : '300px' }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Search trends, insights, signals..."
              onFocus={() => setShowSearch(true)}
              onBlur={() => setShowSearch(false)}
              className="w-full px-6 py-3 rounded-full text-sm font-light outline-none transition-all"
              style={{ 
                background: theme === 'dark' ? 'rgba(82, 70, 57, 0.3)' : 'rgba(224, 217, 201, 0.2)',
                color: theme === 'dark' ? 'rgb(237, 228, 221)' : 'rgb(71, 70, 68)'
              }}
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-lg"
                  style={{ color: theme === 'dark' ? 'rgb(186, 177, 174)' : 'rgb(186, 177, 174)' }}>
              ⊙
            </span>
          </motion.div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {/* Quick Stats */}
          <div className="flex items-center gap-6 px-6 py-2 rounded-full"
               style={{ 
                 background: theme === 'dark' ? 'rgba(82, 70, 57, 0.3)' : 'rgba(224, 217, 201, 0.2)'
               }}>
            <div className="flex items-center gap-2">
              <span style={{ color: theme === 'dark' ? 'rgb(224, 217, 201)' : 'rgb(186, 177, 174)' }}>◉</span>
              <span className="text-sm font-light" 
                    style={{ color: theme === 'dark' ? 'rgb(237, 228, 221)' : 'rgb(71, 70, 68)' }}>
                12 watching
              </span>
            </div>
            <div className="h-4 w-px" 
                 style={{ background: theme === 'dark' ? 'rgb(82, 70, 57)' : 'rgb(186, 177, 174)' }}></div>
            <div className="flex items-center gap-2">
              <span style={{ color: 'rgb(218, 143, 143)' }}>↗</span>
              <span className="text-sm font-light" 
                    style={{ color: theme === 'dark' ? 'rgb(237, 228, 221)' : 'rgb(71, 70, 68)' }}>
                6 trending
              </span>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 rounded-full transition-all"
              style={{ 
                background: showNotifications 
                  ? (theme === 'dark' ? 'rgba(82, 70, 57, 0.4)' : 'rgba(224, 217, 201, 0.3)')
                  : 'transparent'
              }}
            >
              <span className="text-xl" 
                    style={{ color: theme === 'dark' ? 'rgb(224, 217, 201)' : 'rgb(145, 133, 116)' }}>◔</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full"
                    style={{ background: 'rgb(218, 143, 143)' }} />
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-16 w-96 rounded-2xl shadow-2xl overflow-hidden"
                  style={{ 
                    background: theme === 'dark' ? 'rgba(71, 70, 68, 0.98)' : 'rgba(255,255,255,0.98)',
                    border: theme === 'dark' ? '1px solid rgba(82, 70, 57, 0.5)' : '1px solid rgba(186, 177, 174, 0.2)'
                  }}
                >
                  <div className="p-6" 
                       style={{ borderBottom: theme === 'dark' ? '1px solid rgba(82, 70, 57, 0.3)' : '1px solid rgba(186, 177, 174, 0.1)' }}>
                    <h3 className="text-sm font-light uppercase tracking-wider" 
                        style={{ color: theme === 'dark' ? 'rgb(224, 217, 201)' : 'rgb(145, 133, 116)' }}>
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} 
                           className="px-6 py-4 transition-colors cursor-pointer"
                           style={{ 
                             borderBottom: theme === 'dark' ? '1px solid rgba(82, 70, 57, 0.3)' : '1px solid rgba(186, 177, 174, 0.1)',
                             background: theme === 'dark' ? 'transparent' : 'transparent'
                           }}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-light" 
                               style={{ color: theme === 'dark' ? 'rgb(237, 228, 221)' : 'rgb(71, 70, 68)' }}>
                              {notif.text}
                            </p>
                            <p className="text-xs mt-1" 
                               style={{ color: theme === 'dark' ? 'rgb(186, 177, 174)' : 'rgb(186, 177, 174)' }}>
                              {notif.time} ago
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full"
                                style={{ 
                                  background: notif.type === 'trend' ? 'rgba(218, 143, 143, 0.2)' : 'rgba(224, 217, 201, 0.3)',
                                  color: theme === 'dark' ? 'rgb(224, 217, 201)' : 'rgb(145, 133, 116)'
                                }}>
                            {notif.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-3 rounded-full transition-all"
            style={{ 
              background: theme === 'dark' ? 'rgba(82, 70, 57, 0.3)' : 'rgba(224, 217, 201, 0.2)'
            }}
          >
            <span className="text-xl" 
                  style={{ color: theme === 'dark' ? 'rgb(224, 217, 201)' : 'rgb(145, 133, 116)' }}>
              {theme === 'dark' ? '☉' : '☽'}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}