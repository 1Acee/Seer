// File: components/dashboard/Sidebar.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", symbol: "◈", href: "/dashboard" },
  { id: "trends", label: "All Trends", symbol: "◊", href: "/dashboard/trends" },
  { id: "watchlist", label: "Watchlist", symbol: "◉", href: "/dashboard/watchlist" },
  { id: "calendar", label: "Calendar", symbol: "◐", href: "/dashboard/calendar" },    
  { id: "optimizer", label: "Optimizer", symbol: "◢", href: "/dashboard/optimizer" },
  { id: "settings", label: "Settings", symbol: "◐", href: "/dashboard/settings" }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed left-0 top-0 h-screen w-72 z-40 bg-background border-r border-border flex flex-col"
    >
      <div className="flex-1 flex flex-col p-10">
        {/* Logo */}
        <div className="mb-16">
          <h2 className="text-4xl font-extralight tracking-wide text-foreground font-['Playfair_Display']">
            Seer
          </h2>
          <div 
            className="w-16 h-px mt-4" 
            style={{ 
              background: 'linear-gradient(90deg, var(--accent-color), transparent)'
            }} 
          />
        </div>

        {/* Navigation - Now with flex-1 to take available space */}
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const isHovered = hoveredItem === item.id;
            
            return (
              <Link key={item.id} href={item.href}>
                <motion.div
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all"
                  style={{
                    background: isActive 
                      ? 'var(--card)' 
                      : isHovered 
                      ? 'var(--secondary)' 
                      : 'transparent'
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-12 rounded-full"
                      style={{ backgroundColor: 'var(--accent-color)' }}
                    />
                  )}
                  
                  {/* Symbol */}
                  <span 
                    className="text-2xl"
                    style={{ 
                      color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)'
                    }}
                  >
                    {item.symbol}
                  </span>
                  
                  {/* Label */}
                  <span 
                    className="text-sm font-light tracking-wide"
                    style={{ 
                      color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)'
                    }}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section - Now properly spaced with margin-top */}
        <div className="mt-auto pt-8">
          <div className="p-6 rounded-2xl bg-secondary/50 border border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted">
                <span className="text-background text-sm">KJ</span>
              </div>
              <div>
                <div className="text-sm font-light text-foreground">
                  Kajal Patel
                </div>
                <div className="text-xs text-muted-foreground">
                  Pro Plan
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <div>3 uploads remaining</div>
              <div className="mt-2">
                <span 
                  style={{ color: 'var(--accent-color)' }}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  Upgrade to Elite →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}