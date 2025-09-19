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
      className="fixed left-0 top-0 h-screen w-72 z-40"
      style={{ 
        background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(224,217,201,0.9) 100%)',
        borderRight: '1px solid rgba(186, 177, 174, 0.2)'
      }}
    >
      <div className="p-10">
        {/* Logo */}
        <div className="mb-16">
          <h2 className="text-4xl font-extralight tracking-wide" 
              style={{ 
                fontFamily: 'Playfair Display, serif',
                color: 'rgb(71, 70, 68)'
              }}>
            Seer
          </h2>
          <div className="w-16 h-px mt-4" 
               style={{ 
                 background: 'linear-gradient(90deg, rgb(218, 143, 143), transparent)'
               }} />
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
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
                      ? 'rgba(255,255,255,0.8)' 
                      : isHovered 
                      ? 'rgba(255,255,255,0.4)' 
                      : 'transparent'
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-12 rounded-full"
                      style={{ background: 'rgb(218, 143, 143)' }}
                    />
                  )}
                  
                  {/* Symbol */}
                  <span className="text-2xl" 
                        style={{ 
                          color: isActive ? 'rgb(71, 70, 68)' : 'rgb(145, 133, 116)' 
                        }}>
                    {item.symbol}
                  </span>
                  
                  {/* Label */}
                  <span className="text-sm font-light tracking-wide"
                        style={{ 
                          color: isActive ? 'rgb(71, 70, 68)' : 'rgb(145, 133, 116)' 
                        }}>
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-10 left-10 right-10">
          <div className="p-6 rounded-2xl"
               style={{ 
                 background: 'rgba(224, 217, 201, 0.3)',
                 border: '1px solid rgba(186, 177, 174, 0.2)'
               }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                   style={{ background: 'rgb(186, 177, 174)' }}>
                <span className="text-white text-sm">KJ</span>
              </div>
              <div>
                <div className="text-sm font-light" style={{ color: 'rgb(71, 70, 68)' }}>
                  Kajal Patel
                </div>
                <div className="text-xs" style={{ color: 'rgb(145, 133, 116)' }}>
                  Pro Plan
                </div>
              </div>
            </div>
            <div className="text-xs" style={{ color: 'rgb(145, 133, 116)' }}>
              <div>3 uploads remaining</div>
              <div className="mt-2">
                <span style={{ color: 'rgb(218, 143, 143)', cursor: 'pointer' }}>
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