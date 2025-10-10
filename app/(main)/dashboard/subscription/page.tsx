// app/(main)/dashboard/subscription/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Zap, TrendingUp, Users, Shield, BarChart, Sparkles } from "lucide-react";
import Link from "next/link";

// Mock current user plan - replace with actual user data
const CURRENT_PLAN = 'free'; // 'free' | 'pro' | 'elite'

const PLANS = {
  free: {
    name: 'Basic',
    price: 0,
    interval: 'Forever free',
    description: 'Perfect for getting started',
    features: [
      '5 trend alerts per day',
      '3 categories to track',
      'Basic trend analytics',
      '7-day trend history',
      '1 upload per week',
      'Standard support'
    ],
    limitations: [
      'No API access',
      'No team collaboration',
      'Limited export options',
      'No custom alerts'
    ],
    color: '#6B7280',
    popular: false
  },
  pro: {
    name: 'Pro',
    price: 29,
    interval: 'per month',
    description: 'For serious creators & professionals',
    features: [
      'Unlimited trend alerts',
      'Up to 10 categories',
      'Advanced analytics & predictions',
      '90-day trend history',
      '10 uploads per week',
      'Priority support',
      'Export to CSV/PDF',
      'Custom alert rules',
      'AI trend insights',
      'Competitor tracking'
    ],
    limitations: [
      'No API access',
      'Single user only'
    ],
    color: 'var(--accent-color)',
    popular: true
  },
  elite: {
    name: 'Elite',
    price: 99,
    interval: 'per month',
    description: 'For teams & agencies',
    features: [
      'Everything in Pro',
      'Unlimited uploads',
      'Full API access',
      'Team collaboration (5 seats)',
      'White-label reports',
      'Custom integrations',
      'Dedicated account manager',
      '24/7 phone support',
      'Training sessions',
      'Beta features access'
    ],
    limitations: [],
    color: '#8B5CF6',
    popular: false
  }
};

// Usage metrics for current plan
const USAGE_METRICS = {
  alerts: { used: 3, limit: 5 },
  categories: { used: 3, limit: 3 },
  uploads: { used: 0, limit: 1 },
  history: { current: '7 days', limit: '7 days' }
};

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState(CURRENT_PLAN);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  // Calculate prices with yearly discount
  const getPrice = (plan: string) => {
    const basePrice = PLANS[plan as keyof typeof PLANS].price;
    if (billingCycle === 'yearly' && basePrice > 0) {
      return Math.floor(basePrice * 10); // 2 months free
    }
    return basePrice;
  };

  const handleUpgrade = (plan: string) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
    // In production, this would initiate payment flow
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/settings"
            className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
          >
            ← Back to Settings
          </Link>
          <h1 className="text-4xl font-extralight text-foreground font-['Playfair_Display'] mb-2">
            Subscription & Billing
          </h1>
          <p className="text-muted-foreground font-light">
            Manage your plan and unlock advanced features
          </p>
        </div>

        {/* Current Plan Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-8 border border-border mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
              <h2 className="text-2xl font-light text-foreground">
                {PLANS[currentPlan as keyof typeof PLANS].name}
              </h2>
              <p className="text-muted-foreground mt-1">
                ${getPrice(currentPlan)} {PLANS[currentPlan as keyof typeof PLANS].interval}
              </p>
            </div>
            {currentPlan === 'pro' && (
              <div className="text-sm text-muted-foreground">
                Next billing date: <span className="text-foreground">Feb 1, 2025</span>
              </div>
            )}
          </div>

          {/* Usage Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Daily Alerts</span>
                <span className="text-xs text-foreground">
                  {USAGE_METRICS.alerts.used}/{USAGE_METRICS.alerts.limit}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(USAGE_METRICS.alerts.used / USAGE_METRICS.alerts.limit) * 100}%`,
                    backgroundColor: USAGE_METRICS.alerts.used >= USAGE_METRICS.alerts.limit ? '#EF4444' : 'var(--accent-color)'
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Categories</span>
                <span className="text-xs text-foreground">
                  {USAGE_METRICS.categories.used}/{USAGE_METRICS.categories.limit}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{
                    width: `${(USAGE_METRICS.categories.used / USAGE_METRICS.categories.limit) * 100}%`,
                    backgroundColor: 'var(--accent-color)'
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Weekly Uploads</span>
                <span className="text-xs text-foreground">
                  {USAGE_METRICS.uploads.used}/{USAGE_METRICS.uploads.limit}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{
                    width: `${(USAGE_METRICS.uploads.used / USAGE_METRICS.uploads.limit) * 100}%`,
                    backgroundColor: 'var(--accent-color)'
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">History Access</span>
                <span className="text-xs text-foreground">{USAGE_METRICS.history.current}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-green-500" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-card rounded-2xl p-1 flex gap-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-xl transition-all ${
                billingCycle === 'monthly' 
                  ? 'bg-foreground text-background' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-xl transition-all flex items-center gap-2 ${
                billingCycle === 'yearly' 
                  ? 'bg-foreground text-background' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {Object.entries(PLANS).map(([key, plan], index) => {
            const isCurrentPlan = currentPlan === key;
            const canUpgrade = 
              (currentPlan === 'free' && (key === 'pro' || key === 'elite')) ||
              (currentPlan === 'pro' && key === 'elite');
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-3xl p-8 ${
                  plan.popular 
                    ? 'bg-card border-2' 
                    : 'bg-card/50 border border-border'
                }`}
                style={{
                  borderColor: plan.popular ? 'var(--accent-color)' : undefined
                }}
              >
                {plan.popular && (
                  <div 
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs text-white rounded-full"
                    style={{ backgroundColor: 'var(--accent-color)' }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-light text-foreground mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extralight text-foreground">
                      ${getPrice(key)}
                    </span>
                    <span className="text-muted-foreground">
                      {plan.price > 0 && billingCycle === 'yearly' ? '/year' : plan.interval}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check 
                        className="w-4 h-4 mt-0.5 flex-shrink-0" 
                        style={{ color: plan.popular ? 'var(--accent-color)' : '#10B981' }}
                      />
                      <span className="text-sm text-secondary-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <ul className="space-y-2 mb-6 pt-4 border-t border-border">
                    {plan.limitations.map((limitation, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Action Button */}
                <button
                  onClick={() => canUpgrade && handleUpgrade(key)}
                  disabled={isCurrentPlan || !canUpgrade}
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    isCurrentPlan 
                      ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                      : canUpgrade
                      ? plan.popular
                        ? 'text-white hover:opacity-90'
                        : 'bg-secondary text-foreground hover:bg-muted'
                      : 'bg-secondary/50 text-muted-foreground cursor-not-allowed'
                  }`}
                  style={{
                    backgroundColor: !isCurrentPlan && canUpgrade && plan.popular ? 'var(--accent-color)' : undefined
                  }}
                >
                  {isCurrentPlan ? 'Current Plan' : canUpgrade ? 'Upgrade' : 'Contact Sales'}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Methods Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-3xl p-8 border border-border mb-8"
        >
          <h3 className="text-xl font-light text-foreground mb-6">Payment Methods</h3>
          
          <div className="space-y-4">
            {currentPlan !== 'free' ? (
              <>
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                      VISA
                    </div>
                    <div>
                      <p className="text-sm text-foreground">•••• •••• •••• 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <button className="text-sm text-muted-foreground hover:text-foreground">
                    Edit
                  </button>
                </div>
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  + Add payment method
                </button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No payment method required for free plan
              </p>
            )}
          </div>
        </motion.div>

        {/* Billing History */}
        {currentPlan !== 'free' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-3xl p-8 border border-border"
          >
            <h3 className="text-xl font-light text-foreground mb-6">Billing History</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 hover:bg-secondary/30 rounded-xl transition-colors">
                <div>
                  <p className="text-sm text-foreground">Pro Plan - Monthly</p>
                  <p className="text-xs text-muted-foreground">January 1, 2025</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-foreground">$29.00</span>
                  <button className="text-sm text-muted-foreground hover:text-foreground">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Upgrade Confirmation Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-card rounded-3xl p-8 border border-border"
          >
            <h3 className="text-2xl font-light text-foreground mb-4">
              Upgrade to {PLANS[selectedPlan as keyof typeof PLANS].name}
            </h3>
            <p className="text-muted-foreground mb-6">
              You're about to upgrade your plan. You'll be charged ${getPrice(selectedPlan)} {billingCycle === 'yearly' ? 'per year' : 'per month'}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 py-3 rounded-xl bg-secondary text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-xl text-white transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                Confirm Upgrade
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}