// File: components/dashboard/WatchlistSection.tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

interface WatchlistItem {
  id: string;
  name: string;
  category: string;
  status: "heating" | "stable" | "cooling";
  changePercent: number;
  lastUpdated: string;
}

// Mock data - replace with API call
const mockWatchlist: WatchlistItem[] = [
  {
    id: "w1",
    name: "Dopamine Decor",
    category: "lifestyle",
    status: "heating",
    changePercent: 12.5,
    lastUpdated: "2h ago"
  },
  {
    id: "w2",
    name: "Silent Walking",
    category: "fitness",
    status: "heating",
    changePercent: 8.3,
    lastUpdated: "5h ago"
  },
  {
    id: "w3",
    name: "Digital Minimalism",
    category: "tech",
    status: "stable",
    changePercent: 0.2,
    lastUpdated: "1d ago"
  },
  {
    id: "w4",
    name: "Cottage Core Fashion",
    category: "fashion",
    status: "cooling",
    changePercent: -4.7,
    lastUpdated: "12h ago"
  }
];

export default function WatchlistSection() {
  const [activeTab, setActiveTab] = useState<"all" | "heating" | "stable" | "cooling">("all");
  
  const filteredItems = mockWatchlist.filter(item => 
    activeTab === "all" || item.status === activeTab
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case "heating": return "#FF6B6B";
      case "cooling": return "#6B9FFF";
      case "stable": return "#9a8d7d";
      default: return "#9a8d7d";
    }
  };

  const getStatusSymbol = (status: string) => {
    switch(status) {
      case "heating": return "↗";
      case "cooling": return "↘";
      case "stable": return "→";
      default: return "•";
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-lg dark:shadow-black/30 
                    border border-stone-200 dark:border-stone-800 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extralight text-stone-900 dark:text-stone-100 transition-colors">
          Watchlist
        </h2>
        <Link href="/watchlist">
          <span className="text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 
                         dark:hover:text-stone-100 transition-colors">
            View all →
          </span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 p-1 bg-stone-50 dark:bg-stone-800 rounded-2xl transition-colors">
        {["all", "heating", "stable", "cooling"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 px-3 py-2 rounded-xl text-xs font-light transition-all
                       ${activeTab === tab 
                         ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-stone-100' 
                         : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <Link href={`/trends/${item.id}`}>
              <div className="p-3 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800 
                            transition-all cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-light text-stone-900 dark:text-stone-100 mb-1 transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-stone-500 dark:text-stone-400 transition-colors">
                        {item.category}
                      </span>
                      <span className="text-xs text-stone-400 dark:text-stone-500 transition-colors">
                        {item.lastUpdated}
                      </span>
                    </div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-lg"
                      style={{ color: getStatusColor(item.status) }}
                    >
                      {getStatusSymbol(item.status)}
                    </span>
                    <span 
                      className="text-sm font-light"
                      style={{ color: getStatusColor(item.status) }}
                    >
                      {item.changePercent > 0 ? '+' : ''}{item.changePercent}%
                    </span>
                  </div>
                </div>

                {/* Quick actions - visible on hover */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: 1, 
                    height: "auto",
                    transition: { duration: 0.2 }
                  }}
                  className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 
                           opacity-0 group-hover:opacity-100"
                >
                  <div className="flex items-center gap-3">
                    <button className="text-xs text-stone-600 dark:text-stone-400 
                                     hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                      Unfollow
                    </button>
                    <button className="text-xs text-stone-600 dark:text-stone-400 
                                     hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                      Set alert
                    </button>
                  </div>
                </motion.div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <span className="text-3xl text-stone-300 dark:text-stone-600">◯</span>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 transition-colors">
            No items in this category
          </p>
        </div>
      )}
    </div>
  );
}