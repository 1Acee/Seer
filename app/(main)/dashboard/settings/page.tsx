// File: app/dashboard/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTheme, ACCENT_COLORS, BACKGROUND_THEMES } from '@/contexts/ThemeContext';

const ALL_CATEGORIES = [
  { id: 'beauty', label: 'Beauty', symbol: '◐' },
  { id: 'fashion', label: 'Fashion', symbol: '◑' },
  { id: 'food', label: 'Food & Beverage', symbol: '◒' },
  { id: 'fitness', label: 'Fitness', symbol: '◓' },
  { id: 'tech', label: 'Technology', symbol: '◔' },
  { id: 'finance', label: 'Finance', symbol: '◕' },
  { id: 'lifestyle', label: 'Lifestyle', symbol: '◖' },
  { id: 'gaming', label: 'Gaming', symbol: '◗' },
  { id: 'music', label: 'Music', symbol: '◘' },
  { id: 'home', label: 'Home & DIY', symbol: '◙' },
  { id: 'photography', label: 'Photography', symbol: '◚' },
  { id: 'automotive', label: 'Automotive', symbol: '◛' },
  { id: 'travel', label: 'Travel', symbol: '◜' },
  { id: 'education', label: 'Education', symbol: '◝' }
];

export default function Settings() {
  const { 
    accentColor, 
    backgroundColor, 
    darkMode, 
    setAccentColor, 
    setBackgroundColor, 
    toggleDarkMode 
  } = useTheme();

  // User's selected domains
  const [userDomains, setUserDomains] = useState<string[]>([]);
  const [showDomainSuccess, setShowDomainSuccess] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    trending: true,
    watchlist: true,
    weekly: false
  });
  
  const [privacy, setPrivacy] = useState({
    analytics: true,
    publicProfile: false,
    shareData: false
  });
  
  const [preferences, setPreferences] = useState({
    autoRefresh: true,
    compactView: false,
    showVelocity: true,
    defaultTimeframe: '7d'
  });

  // Load user's selected domains on mount
  useEffect(() => {
    const savedCategories = localStorage.getItem('userSelectedCategories');
    if (savedCategories) {
      setUserDomains(JSON.parse(savedCategories));
    }
  }, []);

  // Handle domain selection
  const toggleDomain = (domainId: string) => {
    let newDomains = [...userDomains];
    
    if (newDomains.includes(domainId)) {
      // Remove domain (but keep minimum of 3)
      if (newDomains.length > 3) {
        newDomains = newDomains.filter(id => id !== domainId);
      } else {
        return; // Don't allow going below 3 domains
      }
    } else if (newDomains.length < 10) {
      // Add domain
      newDomains.push(domainId);
    } else {
      // Show some feedback that max is reached
      return;
    }
    
    setUserDomains(newDomains);
    localStorage.setItem('userSelectedCategories', JSON.stringify(newDomains));
    
    // Show success feedback
    setShowDomainSuccess(true);
    setTimeout(() => setShowDomainSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extralight text-foreground font-['Playfair_Display'] mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground font-light">
            Customize your Seer experience
          </p>
        </div>

        <div className="space-y-8">
          {/* Appearance Section */}
          <section className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
            <h2 className="text-xl font-light text-foreground mb-6">Appearance</h2>
            
            {/* Background Theme Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-secondary-foreground mb-4">
                Background Theme
              </label>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(BACKGROUND_THEMES).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => setBackgroundColor(key as 'beige' | 'stone' | 'slate')}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                      backgroundColor === key 
                        ? 'ring-2' 
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    style={{
                      borderColor: backgroundColor === key ? 'var(--accent-color)' : undefined,
                      '--tw-ring-color': 'rgba(var(--accent-rgb), 0.2)'
                    } as React.CSSProperties}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl shadow-sm"
                        style={{ 
                          background: `linear-gradient(135deg, ${theme.light} 50%, ${theme.dark} 50%)`
                        }}
                      />
                      <div className="text-left">
                        <div className="text-sm font-medium text-foreground">
                          {theme.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {key === 'beige' ? 'Warm & soft' : key === 'stone' ? 'Neutral & clean' : 'Cool & modern'}
                        </div>
                      </div>
                    </div>
                    {backgroundColor === key && (
                      <div 
                        className="absolute top-2 right-2 w-3 h-3 rounded-full"
                        style={{ backgroundColor: 'var(--accent-color)' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Accent Color Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-secondary-foreground mb-4">
                Accent Color
              </label>
              <div className="grid grid-cols-4 gap-3">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setAccentColor(color.value, color.name)}
                    className={`relative group`}
                    title={color.name}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl transition-all duration-300 hover:scale-110 ${
                        accentColor === color.value 
                          ? 'ring-3 ring-foreground ring-offset-2 ring-offset-background scale-105' 
                          : 'hover:ring-2 hover:ring-muted-foreground hover:ring-offset-2'
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                      {accentColor === color.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-background rounded-full shadow-lg"></div>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Applied to buttons, links, charts, and interactive elements across all pages
              </p>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-secondary-foreground">
                  Dark Mode
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Switch between light and dark themes
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  darkMode ? '' : 'bg-muted'
                }`}
                style={{ backgroundColor: darkMode ? 'var(--accent-color)' : undefined }}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-background rounded-full shadow-sm transition-transform duration-300 ${
                    darkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Domains of Interest Section */}
          <section className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-light text-foreground">Domains of Interest</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Select the categories you want to track (minimum 3, maximum 10)
                </p>
              </div>
              {showDomainSuccess && (
                <span className="text-sm text-green-600 dark:text-green-400">
                  ✓ Updated
                </span>
              )}
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  {userDomains.length} selected
                </span>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i < userDomains.length 
                          ? '' 
                          : 'bg-border'
                      }`}
                      style={{
                        backgroundColor: i < userDomains.length ? 'var(--accent-color)' : undefined
                      }}
                    />
                  ))}
                </div>
                {userDomains.length < 3 && (
                  <span className="text-amber-600 dark:text-amber-400">
                    Select at least {3 - userDomains.length} more
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {ALL_CATEGORIES.map((category) => {
                const isSelected = userDomains.includes(category.id);
                const isDisabled = !isSelected && userDomains.length >= 10;
                const cantRemove = isSelected && userDomains.length <= 3;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => !isDisabled && !cantRemove && toggleDomain(category.id)}
                    disabled={isDisabled || cantRemove}
                    className={`relative p-4 rounded-2xl transition-all duration-300 ${
                      isSelected
                        ? 'border-2 scale-[1.02]'
                        : isDisabled
                        ? 'bg-muted/30 opacity-50 cursor-not-allowed border-2 border-transparent'
                        : 'bg-secondary hover:bg-muted border-2 border-transparent hover:border-border hover:scale-[1.02]'
                    } ${cantRemove ? 'cursor-not-allowed' : ''}`}
                    style={{
                      backgroundColor: isSelected ? `rgba(var(--accent-rgb), 0.1)` : undefined,
                      borderColor: isSelected ? 'var(--accent-color)' : undefined
                    }}
                    title={cantRemove ? 'Minimum 3 domains required' : ''}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xl ${
                        isSelected ? '' : 'text-muted-foreground'
                      }`}
                      style={{
                        color: isSelected ? 'var(--accent-color)' : undefined
                      }}>
                        {category.symbol}
                      </span>
                      <span className={`text-sm font-light ${
                        isSelected ? 'text-foreground font-medium' : 'text-secondary-foreground'
                      }`}>
                        {category.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'var(--accent-color)' }}
                        >
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Tip:</span> Your selected domains determine which trends appear on your dashboard 
                and in the All Trends page. Add or remove domains anytime to refine your focus.
              </p>
            </div>
          </section>

          {/* Dashboard Preferences */}
          <section className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
            <h2 className="text-xl font-light text-foreground mb-6">Dashboard</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-secondary-foreground">
                    Auto-refresh data
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Automatically update trends every 5 minutes
                  </p>
                </div>
                <button
                  onClick={() => setPreferences(prev => ({...prev, autoRefresh: !prev.autoRefresh}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    preferences.autoRefresh ? '' : 'bg-muted'
                  }`}
                  style={{ backgroundColor: preferences.autoRefresh ? 'var(--accent-color)' : undefined }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-background rounded-full shadow-sm transition-transform duration-300 ${
                      preferences.autoRefresh ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-secondary-foreground">
                    Compact view
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Show more trends in less space
                  </p>
                </div>
                <button
                  onClick={() => setPreferences(prev => ({...prev, compactView: !prev.compactView}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    preferences.compactView ? '' : 'bg-muted'
                  }`}
                  style={{ backgroundColor: preferences.compactView ? 'var(--accent-color)' : undefined }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-background rounded-full shadow-sm transition-transform duration-300 ${
                      preferences.compactView ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-secondary-foreground">
                    Show velocity indicators
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Display trend momentum arrows and percentages
                  </p>
                </div>
                <button
                  onClick={() => setPreferences(prev => ({...prev, showVelocity: !prev.showVelocity}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    preferences.showVelocity ? '' : 'bg-muted'
                  }`}
                  style={{ backgroundColor: preferences.showVelocity ? 'var(--accent-color)' : undefined }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-background rounded-full shadow-sm transition-transform duration-300 ${
                      preferences.showVelocity ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-3">
                  Default timeframe
                </label>
                <select 
                  value={preferences.defaultTimeframe}
                  onChange={(e) => setPreferences(prev => ({...prev, defaultTimeframe: e.target.value}))}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 text-foreground focus:outline-none focus:ring-2"
                  style={{
                    '--tw-ring-color': 'var(--accent-color)'
                  } as React.CSSProperties}
                >
                  <option value="7d">7 days</option>
                  <option value="14d">14 days</option>
                  <option value="30d">30 days</option>
                </select>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
            <h2 className="text-xl font-light text-foreground mb-6">Notifications</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-secondary-foreground">
                    Email notifications
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Receive updates via email
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({...prev, email: !prev.email}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    notifications.email ? '' : 'bg-muted'
                  }`}
                  style={{ backgroundColor: notifications.email ? 'var(--accent-color)' : undefined }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-background rounded-full shadow-sm transition-transform duration-300 ${
                      notifications.email ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-secondary-foreground">
                    Trending alerts
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get notified when new trends emerge in your categories
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({...prev, trending: !prev.trending}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    notifications.trending ? '' : 'bg-muted'
                  }`}
                  style={{ backgroundColor: notifications.trending ? 'var(--accent-color)' : undefined }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-background rounded-full shadow-sm transition-transform duration-300 ${
                      notifications.trending ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-secondary-foreground">
                    Watchlist updates
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Alerts when your watchlist items change status
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({...prev, watchlist: !prev.watchlist}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    notifications.watchlist ? '' : 'bg-muted'
                  }`}
                  style={{ backgroundColor: notifications.watchlist ? 'var(--accent-color)' : undefined }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-background rounded-full shadow-sm transition-transform duration-300 ${
                      notifications.watchlist ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-secondary-foreground">
                    Weekly digest
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Summary of trends and insights every Monday
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({...prev, weekly: !prev.weekly}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    notifications.weekly ? '' : 'bg-muted'
                  }`}
                  style={{ backgroundColor: notifications.weekly ? 'var(--accent-color)' : undefined }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-background rounded-full shadow-sm transition-transform duration-300 ${
                      notifications.weekly ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Privacy & Data */}
          <section className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
            <h2 className="text-xl font-light text-foreground mb-6">Privacy & Data</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-secondary-foreground">
                    Usage analytics
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Help improve Seer by sharing anonymous usage data
                  </p>
                </div>
                <button
                  onClick={() => setPrivacy(prev => ({...prev, analytics: !prev.analytics}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    privacy.analytics ? '' : 'bg-muted'
                  }`}
                  style={{ backgroundColor: privacy.analytics ? 'var(--accent-color)' : undefined }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-background rounded-full shadow-sm transition-transform duration-300 ${
                      privacy.analytics ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-secondary-foreground">
                    Public profile
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Make your trend discoveries visible to other users
                  </p>
                </div>
                <button
                  onClick={() => setPrivacy(prev => ({...prev, publicProfile: !prev.publicProfile}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    privacy.publicProfile ? '' : 'bg-muted'
                  }`}
                  style={{ backgroundColor: privacy.publicProfile ? 'var(--accent-color)' : undefined }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-background rounded-full shadow-sm transition-transform duration-300 ${
                      privacy.publicProfile ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-4 border-t border-border">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
                  Export my data
                </button>
                <span className="mx-4 text-muted-foreground">•</span>
                <button className="text-sm text-red-600 hover:text-red-700 transition-colors underline underline-offset-2">
                  Delete account
                </button>
              </div>
            </div>
          </section>

          {/* Account */}
          <section className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
            <h2 className="text-xl font-light text-foreground mb-6">Account</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value="user@example.com"
                  readOnly
                  className="w-full px-4 py-2 rounded-xl border border-border bg-secondary/50 text-muted-foreground cursor-not-allowed"
                />
              </div>
              
              <div>
                <button className="px-6 py-2 rounded-xl border border-border text-secondary-foreground hover:bg-secondary transition-colors">
                  Change password
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button 
            className="px-8 py-3 rounded-2xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: 'var(--accent-color)' }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}