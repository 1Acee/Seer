// app/dashboard/settings/SettingsPage.tsx
'use client';

import { useState } from 'react';

const ACCENT_COLORS = [
  { name: 'Coral', value: '#FF6B6B', class: 'bg-[#FF6B6B]' },
  { name: 'Electric Blue', value: '#00D4FF', class: 'bg-[#00D4FF]' },
  { name: 'Neon Green', value: '#39FF14', class: 'bg-[#39FF14]' },
  { name: 'Magenta', value: '#FF00FF', class: 'bg-[#FF00FF]' },
  { name: 'Cyan', value: '#00FFFF', class: 'bg-[#00FFFF]' },
  { name: 'Orange', value: '#FF8C00', class: 'bg-[#FF8C00]' },
  { name: 'Purple', value: '#8A2BE2', class: 'bg-[#8A2BE2]' },
  { name: 'Pink', value: '#FF69B4', class: 'bg-[#FF69B4]' },
];

export default function SettingsPage() {
  const [selectedAccent, setSelectedAccent] = useState('#FF6B6B'); // Default coral
  const [darkMode, setDarkMode] = useState(false);
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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extralight text-stone-900 dark:text-stone-50 font-['Playfair_Display'] mb-2">
            Settings
          </h1>
          <p className="text-stone-600 dark:text-stone-400 font-light">
            Customize your Seer experience
          </p>
        </div>

        <div className="space-y-8">
          {/* Appearance Section */}
          <section className="bg-white/80 dark:bg-stone-800/50 backdrop-blur-sm rounded-3xl p-8 border border-stone-200/50 dark:border-stone-700/50">
            <h2 className="text-xl font-light text-stone-900 dark:text-stone-50 mb-6">Appearance</h2>
            
            {/* Accent Color Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-4">
                Accent Color
              </label>
              <div className="grid grid-cols-4 gap-3">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedAccent(color.value)}
                    className={`relative w-16 h-16 rounded-2xl transition-all duration-300 hover:scale-105 ${color.class} ${
                      selectedAccent === color.value 
                        ? 'ring-4 ring-stone-900 dark:ring-stone-50 ring-offset-2 ring-offset-stone-50 dark:ring-offset-stone-900' 
                        : 'hover:ring-2 hover:ring-stone-400 hover:ring-offset-2'
                    }`}
                    title={color.name}
                  >
                    {selectedAccent === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                Changes will be applied across all trend tiles, buttons, and chart highlights
              </p>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Dark Mode
                </label>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Switch between light and dark themes
                </p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  darkMode ? 'bg-stone-800' : 'bg-stone-200'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                    darkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Dashboard Preferences */}
          <section className="bg-white/80 dark:bg-stone-800/50 backdrop-blur-sm rounded-3xl p-8 border border-stone-200/50 dark:border-stone-700/50">
            <h2 className="text-xl font-light text-stone-900 dark:text-stone-50 mb-6">Dashboard</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Auto-refresh data
                  </label>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Automatically update trends every 5 minutes
                  </p>
                </div>
                <button
                  onClick={() => setPreferences(prev => ({...prev, autoRefresh: !prev.autoRefresh}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300`}
                  style={{ backgroundColor: preferences.autoRefresh ? selectedAccent : '#d6d3d1' }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                      preferences.autoRefresh ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Compact view
                  </label>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Show more trends in less space
                  </p>
                </div>
                <button
                  onClick={() => setPreferences(prev => ({...prev, compactView: !prev.compactView}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300`}
                  style={{ backgroundColor: preferences.compactView ? selectedAccent : '#d6d3d1' }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                      preferences.compactView ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Show velocity indicators
                  </label>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Display trend momentum arrows and percentages
                  </p>
                </div>
                <button
                  onClick={() => setPreferences(prev => ({...prev, showVelocity: !prev.showVelocity}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300`}
                  style={{ backgroundColor: preferences.showVelocity ? selectedAccent : '#d6d3d1' }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                      preferences.showVelocity ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">
                  Default timeframe
                </label>
                <select 
                  value={preferences.defaultTimeframe}
                  onChange={(e) => setPreferences(prev => ({...prev, defaultTimeframe: e.target.value}))}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-600 bg-white/50 dark:bg-stone-700/50 text-stone-900 dark:text-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-500"
                >
                  <option value="7d">7 days</option>
                  <option value="14d">14 days</option>
                  <option value="30d">30 days</option>
                </select>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-white/80 dark:bg-stone-800/50 backdrop-blur-sm rounded-3xl p-8 border border-stone-200/50 dark:border-stone-700/50">
            <h2 className="text-xl font-light text-stone-900 dark:text-stone-50 mb-6">Notifications</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Email notifications
                  </label>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Receive updates via email
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({...prev, email: !prev.email}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300`}
                  style={{ backgroundColor: notifications.email ? selectedAccent : '#d6d3d1' }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                      notifications.email ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Trending alerts
                  </label>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Get notified when new trends emerge in your categories
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({...prev, trending: !prev.trending}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300`}
                  style={{ backgroundColor: notifications.trending ? selectedAccent : '#d6d3d1' }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                      notifications.trending ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Watchlist updates
                  </label>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Alerts when your watchlist items change status
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({...prev, watchlist: !prev.watchlist}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300`}
                  style={{ backgroundColor: notifications.watchlist ? selectedAccent : '#d6d3d1' }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                      notifications.watchlist ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Weekly digest
                  </label>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Summary of trends and insights every Monday
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({...prev, weekly: !prev.weekly}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300`}
                  style={{ backgroundColor: notifications.weekly ? selectedAccent : '#d6d3d1' }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                      notifications.weekly ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Privacy & Data */}
          <section className="bg-white/80 dark:bg-stone-800/50 backdrop-blur-sm rounded-3xl p-8 border border-stone-200/50 dark:border-stone-700/50">
            <h2 className="text-xl font-light text-stone-900 dark:text-stone-50 mb-6">Privacy & Data</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Usage analytics
                  </label>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Help improve Seer by sharing anonymous usage data
                  </p>
                </div>
                <button
                  onClick={() => setPrivacy(prev => ({...prev, analytics: !prev.analytics}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300`}
                  style={{ backgroundColor: privacy.analytics ? selectedAccent : '#d6d3d1' }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                      privacy.analytics ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Public profile
                  </label>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Make your trend discoveries visible to other users
                  </p>
                </div>
                <button
                  onClick={() => setPrivacy(prev => ({...prev, publicProfile: !prev.publicProfile}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300`}
                  style={{ backgroundColor: privacy.publicProfile ? selectedAccent : '#d6d3d1' }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                      privacy.publicProfile ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Data sharing with partners
                  </label>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Share aggregated insights with trusted research partners
                  </p>
                </div>
                <button
                  onClick={() => setPrivacy(prev => ({...prev, shareData: !prev.shareData}))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300`}
                  style={{ backgroundColor: privacy.shareData ? selectedAccent : '#d6d3d1' }}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                      privacy.shareData ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
                <button className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 transition-colors underline underline-offset-2">
                  Export my data
                </button>
                <span className="mx-4 text-stone-300 dark:text-stone-600">•</span>
                <button className="text-sm text-red-600 hover:text-red-700 transition-colors underline underline-offset-2">
                  Delete account
                </button>
              </div>
            </div>
          </section>

          {/* Account */}
          <section className="bg-white/80 dark:bg-stone-800/50 backdrop-blur-sm rounded-3xl p-8 border border-stone-200/50 dark:border-stone-700/50">
            <h2 className="text-xl font-light text-stone-900 dark:text-stone-50 mb-6">Account</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value="kajal@example.com"
                  readOnly
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-100/50 dark:bg-stone-700/30 text-stone-600 dark:text-stone-400 cursor-not-allowed"
                />
              </div>
              
              <div className="flex gap-3">
                <button className="px-6 py-2 rounded-xl border border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                  Change password
                </button>
                <button className="px-6 py-2 rounded-xl border border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
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
            style={{ backgroundColor: selectedAccent }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}