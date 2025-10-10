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
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-muted-foreground">
                <path d="M10 2C8.5 2 7.5 3 7.5 4.5V5C5.5 5.5 4 7.5 4 10v4l-2 2v1h16v-1l-2-2v-4c0-2.5-1.5-4.5-3.5-5v-.5C12.5 3 11.5 2 10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 17.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-muted-foreground">
                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.5 10c0 .5.2.9.5 1.2l.3.3a2 2 0 01-1.4 3.4h-.4c-.5 0-.9.2-1.2.5-.3.3-.5.7-.5 1.2v.4a2 2 0 01-3.4 1.4l-.3-.3c-.3-.3-.7-.5-1.2-.5-.4 0-.9.2-1.2.5l-.3.3a2 2 0 01-3.4-1.4v-.4c0-.5-.2-.9-.5-1.2-.3-.3-.7-.5-1.2-.5h-.4a2 2 0 01-1.4-3.4l.3-.3c.3-.3.5-.7.5-1.2 0-.4-.2-.9-.5-1.2l-.3-.3a2 2 0 011.4-3.4h.4c.5 0 .9-.2 1.2-.5.3-.3.5-.7.5-1.2v-.4a2 2 0 013.4-1.4l.3.3c.3.3.8.5 1.2.5.5 0 .9-.2 1.2-.5l.3-.3a2 2 0 013.4 1.4v.4c0 .5.2.9.5 1.2.3.3.7.5 1.2.5h.4a2 2 0 011.4 3.4l-.3.3c-.3.3-.5.7-.5 1.2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </Link>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-3 rounded-full transition-all bg-secondary/50"
          >
            {darkMode ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-muted-foreground">
                <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 2v2M10 16v2M18 10h-2M4 10H2M15.66 4.34l-1.41 1.41M5.75 14.25l-1.41 1.41M15.66 15.66l-1.41-1.41M5.75 5.75L4.34 4.34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <span className="text-xl text-muted-foreground">☽</span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}