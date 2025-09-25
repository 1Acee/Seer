// File: components/dashboard/TopNav.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";

export default function TopNav() {
  const { darkMode, toggleDarkMode } = useTheme();
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
      className="fixed top-0 right-0 h-20 z-40 backdrop-blur-[20px]"
      style={{ 
        left: '288px', // Accounts for 72*4 = 288px sidebar width
        backgroundColor: 'var(--background)',
        borderBottom: '1px solid var(--border)'
      }}
    >
      <div className="h-full px-8 flex items-center justify-between">
        {/* Search Section */}
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
              className="w-full px-6 py-3 rounded-full text-sm font-light outline-none transition-all bg-secondary/50 text-foreground placeholder-muted-foreground"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
              ⊙
            </span>
          </motion.div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {/* Quick Stats */}
          <div className="flex items-center gap-6 px-6 py-2 rounded-full bg-secondary/50">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">◉</span>
              <span className="text-sm font-light text-foreground">
                12 watching
              </span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center gap-2">
              <span style={{ color: 'var(--accent-color)' }}>↗</span>
              <span className="text-sm font-light text-foreground">
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
                backgroundColor: showNotifications ? 'var(--secondary)' : 'transparent'
              }}
            >
              <span className="text-xl text-muted-foreground">◔</span>
              <span 
                className="absolute top-2 right-2 w-2 h-2 rounded-full" 
                style={{ backgroundColor: 'var(--accent-color)' }}
              />
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-16 w-96 rounded-2xl shadow-2xl overflow-hidden bg-card border border-border"
                >
                  <div className="p-6 border-b border-border">
                    <h3 className="text-sm font-light uppercase tracking-wider text-muted-foreground">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className="px-6 py-4 transition-colors cursor-pointer border-b border-border hover:bg-secondary/20"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-light text-foreground">
                              {notif.text}
                            </p>
                            <p className="text-xs mt-1 text-muted-foreground">
                              {notif.time} ago
                            </p>
                          </div>
                          <span 
                            className="text-xs px-2 py-1 rounded-full"
                            style={{ 
                              backgroundColor: notif.type === 'trend' ? 'rgba(var(--accent-rgb), 0.2)' : 'var(--secondary)',
                              color: 'var(--foreground)'
                            }}
                          >
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

          {/* Settings Cog */}
          <Link href="/dashboard/settings">
            <motion.button
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full transition-all bg-secondary/50"
              title="Settings"
            >
              <span className="text-xl text-muted-foreground">
                ⚙
              </span>
            </motion.button>
          </Link>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-3 rounded-full transition-all bg-secondary/50"
          >
            <span className="text-xl text-muted-foreground">
              {darkMode ? '☉' : '☽'}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}