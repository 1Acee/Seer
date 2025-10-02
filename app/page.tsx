// app/page.tsx - Updated Landing Page with Correct Dashboard Preview
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  TrendingUp, 
  Sparkles, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  Check,
  ArrowRight,
  Menu,
  X,
  Play,
  Star,
  Search
} from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.98]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <motion.header 
        style={{ opacity: headerOpacity }}
        className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">Seer</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How it Works
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
                Testimonials
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign in
              </Link>
              <Link href="/onboarding" className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-6 space-y-4">
              <Link href="#features" className="block text-gray-600">Features</Link>
              <Link href="#how-it-works" className="block text-gray-600">How it Works</Link>
              <Link href="#pricing" className="block text-gray-600">Pricing</Link>
              <Link href="/login" className="block text-gray-600">Sign in</Link>
              <Link href="/onboarding" className="block w-full text-center px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI-Powered Trend Intelligence
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
            >
              Surface Tomorrow&apos;s<br />
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Trends Today
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
            >
              Seer delivers actionable, evidence-backed predictions with clear lead times. 
              Stay ahead of the curve with AI that identifies emerging trends before they go mainstream.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/onboarding" className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Start Free Trial
              </Link>
              <button className="px-8 py-4 bg-white text-gray-900 rounded-lg border border-gray-200 hover:border-gray-300 transition-all font-medium text-lg flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>
          </div>

          {/* Updated Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 blur-3xl" />
              <div className="relative bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
                {/* Browser Chrome */}
                <div className="bg-stone-900 p-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center text-stone-400 text-sm">seer.app/dashboard</div>
                </div>
                
                {/* Dashboard Content - Matching actual dashboard */}
                <div className="bg-gradient-to-br from-stone-50 via-stone-50 to-amber-50/20 p-6">
                  {/* Top Nav Bar */}
                  <div className="flex items-center justify-between mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-stone-200/50">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-light text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>Seer</span>
                      <div className="flex-1 max-w-md relative">
                        <input 
                          type="text" 
                          placeholder="Search trends, insights, signals..."
                          className="w-full pl-10 pr-4 py-2 bg-stone-50 rounded-xl text-sm border border-stone-200"
                          disabled
                        />
                        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-stone-600 flex items-center gap-1">
                        <span className="text-violet-600">◉</span> 12 watching
                      </span>
                      <span className="text-sm text-stone-600">6 trending</span>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-400" />
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex gap-6">
                    {/* Sidebar */}
                    <div className="w-48 space-y-1">
                      <div className="bg-white/60 rounded-xl p-2 border border-violet-200">
                        <span className="text-sm text-stone-700 flex items-center gap-2">
                          <span className="text-violet-600">◈</span> Dashboard
                        </span>
                      </div>
                      <div className="p-2">
                        <span className="text-sm text-stone-600 flex items-center gap-2">
                          <span className="text-stone-400">◇</span> All Trends
                        </span>
                      </div>
                      <div className="p-2">
                        <span className="text-sm text-stone-600 flex items-center gap-2">
                          <span className="text-stone-400">◉</span> Watchlist
                        </span>
                      </div>
                      <div className="p-2">
                        <span className="text-sm text-stone-600 flex items-center gap-2">
                          <span className="text-stone-400">◐</span> Calendar
                        </span>
                      </div>
                      <div className="p-2">
                        <span className="text-sm text-stone-600 flex items-center gap-2">
                          <span className="text-stone-400">▲</span> Optimizer
                        </span>
                      </div>
                    </div>

                    {/* Main Dashboard */}
                    <div className="flex-1">
                      {/* Welcome Section */}
                      <div className="mb-6">
                        <h1 className="text-4xl font-extralight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                          Intelligence <em>unfolds</em>
                        </h1>
                        <p className="text-stone-600">Welcome back, Kajal. Today&apos;s emerging patterns across your domains</p>
                      </div>

                      {/* Stats Bar */}
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white/80 rounded-xl p-4 border border-stone-200/50">
                          <div className="text-2xl font-semibold text-stone-900">247</div>
                          <div className="text-xs text-stone-500 uppercase tracking-wide">Active Signals</div>
                          <div className="text-xs text-violet-600">+12%</div>
                        </div>
                        <div className="bg-white/80 rounded-xl p-4 border border-stone-200/50">
                          <div className="text-2xl font-semibold text-stone-900">18</div>
                          <div className="text-xs text-stone-500 uppercase tracking-wide">Trending Now</div>
                          <div className="text-xs text-violet-600">+3</div>
                        </div>
                        <div className="bg-white/80 rounded-xl p-4 border border-stone-200/50">
                          <div className="text-2xl font-semibold text-stone-900">6</div>
                          <div className="text-xs text-stone-500 uppercase tracking-wide">Peak Predictions</div>
                          <div className="text-xs text-violet-600">This week</div>
                        </div>
                        <div className="bg-white/80 rounded-xl p-4 border border-stone-200/50">
                          <div className="text-2xl font-semibold text-stone-900">94%</div>
                          <div className="text-xs text-stone-500 uppercase tracking-wide">Success Rate</div>
                          <div className="text-xs text-violet-600">↑ 2%</div>
                        </div>
                      </div>

                      {/* Emerging Trends Section */}
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-light">Emerging Trends</h2>
                        <span className="text-sm text-stone-500">VIEW ALL →</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Trend Card 1 */}
                        <div className="bg-white/90 rounded-2xl p-5 border border-stone-200/50 hover:shadow-lg transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium text-stone-900 text-lg">Quiet Luxury Aesthetic</h3>
                              <span className="text-xs text-stone-500 uppercase">Fashion</span>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-semibold text-violet-600">88</div>
                              <div className="text-xs text-stone-500">SCORE</div>
                            </div>
                          </div>
                          
                          {/* Mini Chart */}
                          <div className="h-16 flex items-end gap-1 mb-3">
                            <div className="w-3 bg-violet-200 rounded-t" style={{ height: "40%" }}></div>
                            <div className="w-3 bg-violet-300 rounded-t" style={{ height: "50%" }}></div>
                            <div className="w-3 bg-violet-400 rounded-t" style={{ height: "60%" }}></div>
                            <div className="w-3 bg-violet-500 rounded-t" style={{ height: "75%" }}></div>
                            <div className="w-3 bg-violet-600 rounded-t" style={{ height: "90%" }}></div>
                            <div className="w-3 bg-gradient-to-t from-violet-600 to-purple-500 rounded-t border-2 border-white" style={{ height: "100%" }}></div>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Low Saturation</span>
                            <span className="text-stone-500">~8 days to peak</span>
                          </div>
                        </div>

                        {/* Trend Card 2 */}
                        <div className="bg-white/90 rounded-2xl p-5 border border-stone-200/50 hover:shadow-lg transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium text-stone-900 text-lg">Dopamine Decor</h3>
                              <span className="text-xs text-stone-500 uppercase">Lifestyle</span>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-semibold text-violet-600">92</div>
                              <div className="text-xs text-stone-500">SCORE</div>
                            </div>
                          </div>
                          
                          {/* Mini Chart */}
                          <div className="h-16 flex items-end gap-1 mb-3">
                            <div className="w-3 bg-violet-200 rounded-t" style={{ height: "30%" }}></div>
                            <div className="w-3 bg-violet-300 rounded-t" style={{ height: "45%" }}></div>
                            <div className="w-3 bg-violet-400 rounded-t" style={{ height: "65%" }}></div>
                            <div className="w-3 bg-violet-500 rounded-t" style={{ height: "85%" }}></div>
                            <div className="w-3 bg-violet-600 rounded-t" style={{ height: "95%" }}></div>
                            <div className="w-3 bg-gradient-to-t from-violet-600 to-purple-500 rounded-t border-2 border-white" style={{ height: "100%" }}></div>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">High Novelty</span>
                            <span className="text-stone-500">+12.5% heating</span>
                          </div>
                        </div>
                      </div>

                      {/* Watchlist Section */}
                      <div className="bg-white/60 rounded-xl p-4 border border-stone-200/50">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium text-stone-900">Watchlist</h3>
                          <div className="flex gap-2 text-xs">
                            <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded-lg">ALL</span>
                            <span className="px-2 py-1 text-stone-500">HEATING</span>
                            <span className="px-2 py-1 text-stone-500">STABLE</span>
                            <span className="px-2 py-1 text-stone-500">COOLING</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-2 border-b border-stone-100">
                            <span className="text-sm text-stone-700">Dopamine Decor</span>
                            <span className="text-xs text-green-600">+12.5% heating</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-stone-700">Silent Luxury</span>
                            <span className="text-xs text-stone-500">147 signals</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <span className="text-gray-600 font-medium">Trusted by creators at</span>
            <span className="text-2xl font-bold text-gray-400">YouTube</span>
            <span className="text-2xl font-bold text-gray-400">TikTok</span>
            <span className="text-2xl font-bold text-gray-400">Instagram</span>
            <span className="text-2xl font-bold text-gray-400">Twitter</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to stay ahead
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed for creators, agencies, and brands who want to lead, not follow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl border border-gray-200 hover:border-violet-200 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Predictive Analytics</h3>
              <p className="text-gray-600">
                AI-powered predictions with clear lead times, showing you exactly when trends will peak.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl border border-gray-200 hover:border-indigo-200 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Monitoring</h3>
              <p className="text-gray-600">
                Track trends across multiple platforms with live updates and instant alerts.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Evidence-Based Insights</h3>
              <p className="text-gray-600">
                Every prediction backed by data from Reddit, TikTok, YouTube, and more.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 rounded-2xl border border-gray-200 hover:border-pink-200 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Swipe Mode</h3>
              <p className="text-gray-600">
                Curate trends Tinder-style. Swipe right to follow, left to pass. Stay engaged daily.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Content Optimizer</h3>
              <p className="text-gray-600">
                Upload your content and get trend-aware suggestions to maximize reach and engagement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-6 rounded-2xl border border-gray-200 hover:border-green-200 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trust & Transparency</h3>
              <p className="text-gray-600">
                See exactly why trends are predicted with full source visibility and confidence scores.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Seer Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to stay ahead of the curve
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Your Domains</h3>
              <p className="text-gray-600">
                Choose 3-5 categories that matter to your content strategy
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Discover Trends Daily</h3>
              <p className="text-gray-600">
                Swipe through AI-curated trends or browse detailed analytics
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create & Optimize</h3>
              <p className="text-gray-600">
                Use insights to create content that rides the wave at the perfect time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. Always know what you&apos;ll pay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="rounded-2xl border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic</h3>
              <p className="text-gray-600 mb-4">Perfect for getting started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-600">1 upload per week</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-600">24h dashboard delay</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-600">Limited watchlist</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-600">Standard alerts</span>
                </li>
              </ul>
              <Link href="/onboarding" className="block w-full text-center px-6 py-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-all">
                Start Free
              </Link>
            </div>

            {/* Pro Plan - Featured */}
            <div className="rounded-2xl border-2 border-violet-600 p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-violet-600 text-white text-sm rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro</h3>
              <p className="text-gray-600 mb-4">For serious creators</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-600">10 uploads per week</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-600">Real-time dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-600">Unlimited watchlist</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-600">Advanced alerts & exports</span>
                </li>
              </ul>
              <Link href="/onboarding" className="block w-full text-center px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all">
                Start Free Trial
              </Link>
            </div>

            {/* Elite Plan */}
            <div className="rounded-2xl border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Elite</h3>
              <p className="text-gray-600 mb-4">For teams & agencies</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-600">Unlimited uploads</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-600">Priority processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-600">Team seats</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-gray-600">API access</span>
                </li>
              </ul>
              <Link href="/onboarding" className="block w-full text-center px-6 py-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-all">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by creators worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our users are saying about Seer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                &quot;Seer helped me identify the glass skin trend 2 weeks before it exploded. My content got 10x the usual engagement!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-pink-400 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-900">Sarah Chen</p>
                  <p className="text-sm text-gray-600">Beauty Creator</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                &quot;The swipe mode is addictive! I check it every morning with my coffee. It&apos;s like Tinder for trends.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-900">Marcus Johnson</p>
                  <p className="text-sm text-gray-600">Fitness Influencer</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                &quot;As an agency, Seer gives us the edge. We pitch trends to clients before competitors even know they exist.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-900">Emily Rodriguez</p>
                  <p className="text-sm text-gray-600">Agency Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to predict the future?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of creators who are already surfing tomorrow&apos;s trends today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding" className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Get Started Free <ArrowRight className="inline ml-2 w-5 h-5" />
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-white">Seer</span>
              </div>
              <p className="text-sm">
                Surface tomorrow&apos;s trends today with AI-powered intelligence.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">GDPR</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © 2025 Seer. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
              <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}