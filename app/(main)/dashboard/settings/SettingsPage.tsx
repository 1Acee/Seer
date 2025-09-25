'use client';

import { useState } from 'react';
import { useTheme, ACCENT_COLORS, BACKGROUND_THEMES } from '@/contexts/ThemeContext';

export default function SettingsPage() {
  const { 
    accentColor, 
    backgroundColor, 
    darkMode, 
    setAccentColor, 
    setBackgroundColor, 
    toggleDarkMode 
  } = useTheme();

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
                        ? 'border-[var(--accent-color)] ring-2 ring-[var(--accent-color)]/20' 
                        : 'border-border hover:border-muted-foreground'
                    }`}
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
                      className={`w-16 h-16 rounded-2xl transition-all duration-300 hover:scale-110 ${
                        accentColor === color.value 
                          ? 'ring-4 ring-foreground ring-offset-2 ring-offset-background scale-105' 
                          : 'hover:ring-2 hover:ring-muted-foreground hover:ring-offset-2'
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                      {accentColor === color.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 bg-background rounded-full shadow-lg"></div>
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
                  className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
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
              
              <div className="flex gap-3">
                <button className="px-6 py-2 rounded-xl border border-border text-secondary-foreground hover:bg-secondary transition-colors">
                  Change password
                </button>
                <button className="px-6 py-2 rounded-xl border border-border text-secondary-foreground hover:bg-secondary transition-colors">
                  Update categories
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