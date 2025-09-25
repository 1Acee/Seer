"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const trends = [
  {
    id: "1",
    name: "Quiet Luxury Aesthetic",
    category: "Fashion",
    score: 88,
    leadTime: 8,
    momentum: [32, 38, 45, 52, 58, 65, 72, 78, 85],
    velocity: 22.4,
    saturation: 18,
    signals: { reddit: 8, tiktok: 15, instagram: 22, youtube: 5 },
    tags: ["Cross-Platform", "High Novelty"],
    description: "Understated elegance dominates fashion conversations"
  },
  {
    id: "2",
    name: "Glass Skin Routine",
    category: "Beauty",
    score: 85,
    leadTime: 15,
    momentum: [28, 30, 33, 36, 40, 45, 50, 56, 62],
    velocity: 8.7,
    saturation: 32,
    signals: { tiktok: 28, youtube: 12, reddit: 5, instagram: 18 },
    tags: ["Low Saturation"],
    description: "Korean-inspired skincare achieving mainstream adoption"
  },
  {
    id: "3",
    name: "Protein Coffee",
    category: "Fitness",
    score: 79,
    leadTime: 10,
    momentum: [22, 25, 28, 32, 38, 45, 51, 58, 65],
    velocity: 12.3,
    saturation: 45,
    signals: { reddit: 18, tiktok: 9, youtube: 7, instagram: 11 },
    tags: ["High Novelty"],
    description: "Functional beverages merge with fitness culture"
  }
];

const watchlistItems = [
  { 
    id: "w1", 
    name: "Dopamine Decor", 
    category: "Lifestyle", 
    change: 12.5, 
    status: "heating",
    signals: 147,
    peakEstimate: "6 days",
    momentum: [45, 48, 52, 56, 61, 67, 72],
    lastAlert: "2h ago"
  },
  { 
    id: "w2", 
    name: "Silent Walking", 
    category: "Fitness", 
    change: 8.3, 
    status: "heating",
    signals: 89,
    peakEstimate: "12 days",
    momentum: [32, 34, 37, 40, 43, 47, 51],
    lastAlert: "5h ago"
  },
  { 
    id: "w3", 
    name: "Digital Minimalism", 
    category: "Tech", 
    change: 0.2, 
    status: "stable",
    signals: 234,
    peakEstimate: "Peaked",
    momentum: [78, 78, 79, 78, 79, 78, 78],
    lastAlert: "1d ago"
  },
  { 
    id: "w4", 
    name: "Cottage Core Fashion", 
    category: "Fashion", 
    change: -4.7, 
    status: "cooling",
    signals: 156,
    peakEstimate: "Declining",
    momentum: [85, 82, 78, 73, 68, 62, 56],
    lastAlert: "12h ago"
  }
];

export default function DashboardPage() {
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);
  const [watchlistTab, setWatchlistTab] = useState<'all' | 'heating' | 'stable' | 'cooling'>('all');
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    setUserName(userData.userName || "");
  }, []);

  const filteredWatchlist = watchlistTab === 'all' 
    ? watchlistItems 
    : watchlistItems.filter(item => item.status === watchlistTab);

  return (
    <div className="min-h-screen bg-background">
      
      {/* Header Section */}
      <div className="px-8 lg:px-16 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl lg:text-8xl font-extralight tracking-tight text-foreground font-['Playfair_Display']">
            Intelligence <em style={{ fontWeight: 300 }}>unfolds</em>
          </h1>
          <p className="mt-4 text-lg lg:text-xl font-light text-muted-foreground">
            {userName && `Welcome back, ${userName.split(' ')[0]}. `}
            Today's emerging patterns across your domains
          </p>
        </motion.div>

        {/* Metrics Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-4 gap-8"
        >
          {[
            { label: 'Active Signals', value: '247', change: '+12%' },
            { label: 'Trending Now', value: '18', change: '+3' },
            { label: 'Peak Predictions', value: '6', change: 'This week' },
            { label: 'Success Rate', value: '94%', change: '↑ 2%' }
          ].map((metric, i) => (
            <div key={i} className="border-l-2 pl-4 border-border">
              <div className="text-3xl font-extralight text-foreground">
                {metric.value}
              </div>
              <div className="text-xs uppercase tracking-widest mt-1 text-muted-foreground">
                {metric.label}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--accent-color)' }}>
                {metric.change}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="px-8 lg:px-16 pb-16">
        <div className="flex gap-8">
          
          {/* Trends Section - Left side */}
          <div className="flex-1" style={{ maxWidth: '66.666%' }}>
            <div className="flex justify-between items-end mb-6 pb-4 border-b border-border">
              <h2 className="text-3xl font-extralight text-foreground">
                Emerging Trends
              </h2>
              <button className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                View All →
              </button>
            </div>

            <div className="space-y-6">
              {trends.map((trend, index) => (
                <motion.div
                  key={trend.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 bg-card border border-border"
                >
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-light mb-2 text-foreground">
                          {trend.name}
                        </h3>
                        <span className="inline-block px-3 py-1 text-xs uppercase tracking-wider rounded-full bg-secondary text-secondary-foreground">
                          {trend.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-extralight text-foreground">
                          {trend.score}
                        </div>
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">
                          Score
                        </div>
                      </div>
                    </div>

                    {/* Chart Area */}
                    <div className="p-4 rounded-xl mb-6 bg-secondary/50">
                      <svg width="100%" height="80" viewBox="0 0 300 80">
                        <defs>
                          <linearGradient id={`grad-${trend.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        <path
                          d={`M 0,${80 - (trend.momentum[0] / 100) * 80} ${
                            trend.momentum.map((val, i) => 
                              `L ${(i / (trend.momentum.length - 1)) * 300},${80 - (val / 100) * 80}`
                            ).join(' ')
                          } L 300,80 L 0,80 Z`}
                          fill={`url(#grad-${trend.id})`}
                        />
                        <path
                          d={`M 0,${80 - (trend.momentum[0] / 100) * 80} ${
                            trend.momentum.map((val, i) => 
                              `L ${(i / (trend.momentum.length - 1)) * 300},${80 - (val / 100) * 80}`
                            ).join(' ')
                          }`}
                          fill="none"
                          stroke="var(--accent-color)"
                          strokeWidth="2"
                        />
                      </svg>
                      <div className="flex justify-between mt-4">
                        <span className="text-xs text-muted-foreground">
                          ↗ {trend.velocity}% velocity
                        </span>
                        <span className="text-xs" style={{ color: 'var(--accent-color)' }}>
                          Peak in {trend.leadTime} days
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center mt-6">
                      <button className="text-xs uppercase tracking-wider hover:opacity-70 transition-opacity text-muted-foreground">
                        Follow Trend
                      </button>
                      
                      <button 
                        onClick={() => window.location.href = `/trends/${trend.id}`}
                        className="px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all hover:scale-105 hover:shadow-lg text-white font-medium"
                        style={{ backgroundColor: 'var(--accent-color)' }}>
                        Expand →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Enhanced Watchlist Section - 1 column */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl overflow-hidden shadow-lg bg-card border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-2xl font-extralight mb-4 text-foreground">
                  Watchlist
                </h2>
                
                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-xl bg-secondary/50">
                  {(['all', 'heating', 'stable', 'cooling'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setWatchlistTab(tab)}
                      className="flex-1 px-3 py-2 rounded-lg text-xs uppercase tracking-wider transition-all"
                      style={{ 
                        backgroundColor: watchlistTab === tab ? 'var(--card)' : 'transparent',
                        color: watchlistTab === tab ? 'var(--foreground)' : 'var(--muted-foreground)'
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-4">
                  {filteredWatchlist.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-xl transition-all hover:scale-[1.02] bg-secondary/30 border border-border"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-light text-foreground">
                            {item.name}
                          </h4>
                          <p className="text-xs mt-1 text-muted-foreground">
                            {item.category} • {item.signals} signals
                          </p>
                        </div>
                        <div className="text-right">
                          <div 
                            className="text-lg font-light"
                            style={{ 
                              color: item.status === 'heating' ? 'var(--accent-color)' : 
                                     item.status === 'cooling' ? '#6b9fff' : 
                                     'var(--muted-foreground)'
                            }}
                          >
                            {item.change > 0 ? '+' : ''}{item.change}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.status}
                          </div>
                        </div>
                      </div>
                      
                      {/* Mini sparkline */}
                      <div className="mb-3">
                        <svg width="100%" height="30" viewBox="0 0 100 30">
                          <path
                            d={`M 0,${30 - (item.momentum[0] / 100) * 30} ${
                              item.momentum.map((val, i) => 
                                `L ${(i / (item.momentum.length - 1)) * 100},${30 - (val / 100) * 30}`
                              ).join(' ')
                            }`}
                            fill="none"
                            stroke={
                              item.status === 'heating' ? 'var(--accent-color)' :
                              item.status === 'cooling' ? '#6b9fff' :
                              'var(--muted-foreground)'
                            }
                            strokeWidth="1.5"
                            opacity="0.6"
                          />
                        </svg>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{item.peakEstimate}</span>
                        <span>Alert: {item.lastAlert}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Spotlight Section - Full Width Below */}
        <div className="mt-16">
          <div className="rounded-2xl overflow-hidden shadow-lg p-8 bg-card border border-border">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-extralight text-foreground">
                  Category Spotlight
                </h2>
                <p className="text-sm mt-2 text-muted-foreground">
                  Top emerging trends by domain • Auto-rotating every 8 seconds
                </p>
              </div>
              <button className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                Pause Rotation
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {['Beauty', 'Fashion', 'Tech', 'Fitness', 'Lifestyle'].map((cat, i) => (
                <button
                  key={cat}
                  className="px-4 py-2 rounded-full transition-all flex items-center gap-2"
                  style={{
                    backgroundColor: i === 0 ? 'var(--accent-color)' : 'var(--secondary)',
                    color: i === 0 ? 'white' : 'var(--muted-foreground)'
                  }}
                >
                  <span className="text-lg">
                    {cat === 'Beauty' && '◐'}
                    {cat === 'Fashion' && '◑'}
                    {cat === 'Tech' && '◔'}
                    {cat === 'Fitness' && '◓'}
                    {cat === 'Lifestyle' && '◖'}
                  </span>
                  <span className="text-sm font-light">{cat}</span>
                </button>
              ))}
            </div>

            {/* Spotlight Trends Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {[
                { name: "Glass Skin Routine", velocity: 15.2, saturation: 32, signals: 187 },
                { name: "Blush Contouring", velocity: 12.8, saturation: 28, signals: 134 },
                { name: "Skinimalism", velocity: 8.4, saturation: 45, signals: 92 }
              ].map((trend, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="p-6 rounded-2xl bg-secondary/30 border border-border"
                >
                  <h3 className="text-base font-light mb-4 text-foreground">
                    {trend.name}
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Velocity</span>
                        <span style={{ color: 'var(--accent-color)' }}>
                          +{trend.velocity}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden bg-secondary">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${trend.velocity * 5}%`,
                            backgroundColor: 'var(--accent-color)'
                          }} 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Saturation</span>
                        <span className="text-foreground">{trend.saturation}%</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden bg-secondary">
                        <div 
                          className="h-full rounded-full bg-muted-foreground"
                          style={{ width: `${trend.saturation}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {trend.signals} signals
                      </span>
                      <button className="text-xs" style={{ color: 'var(--accent-color)' }}>
                        Analyze →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Insight Box */}
            <div 
              className="mt-8 p-6 rounded-2xl flex items-start gap-4 border"
              style={{ 
                backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
                borderColor: 'rgba(var(--accent-rgb), 0.2)'
              }}
            >
              <span className="text-2xl" style={{ color: 'var(--accent-color)' }}>◎</span>
              <div>
                <p className="text-sm mb-1 text-foreground">
                  <strong className="font-medium">Weekly Insight:</strong> Beauty trends are showing 
                  exceptional growth patterns with low saturation, indicating strong opportunity for early adoption.
                </p>
                <p className="text-xs text-muted-foreground">
                  Consider creating content around glass skin and blush contouring techniques.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}