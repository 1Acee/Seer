// Categories available in the platform
export const CATEGORIES = [
  { id: 'beauty', label: 'Beauty', icon: '💄' },
  { id: 'fashion', label: 'Fashion', icon: '👗' },
  { id: 'food', label: 'Food & Beverage', icon: '🍔' },
  { id: 'fitness', label: 'Fitness', icon: '💪' },
  { id: 'tech', label: 'Tech', icon: '💻' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'lifestyle', label: 'Lifestyle', icon: '🏡' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'diy', label: 'Home/DIY', icon: '🔨' },
] as const;

// User personas for onboarding
export const PERSONAS = [
  { 
    id: 'creator', 
    label: 'Individual Content Creator',
    description: 'TikTok, Reels, YouTube Shorts',
    icon: '🎬'
  },
  { 
    id: 'agency', 
    label: 'Marketing Agency',
    description: 'Campaign strategy and trends',
    icon: '📊'
  },
  { 
    id: 'pr', 
    label: 'PR Specialist',
    description: 'Brand narrative and messaging',
    icon: '📰'
  },
  { 
    id: 'manager', 
    label: 'Individual Agent/Talent Manager',
    description: 'Creator strategy and growth',
    icon: '🌟'
  },
  { 
    id: 'founder', 
    label: 'Entrepreneur/Founder',
    description: 'Market insights and opportunities',
    icon: '🚀'
  },
] as const;

// Platform options
export const PLATFORMS = [
  { id: 'tiktok', label: 'TikTok', icon: '📱' },
  { id: 'reels', label: 'Instagram Reels', icon: '📷' },
  { id: 'shorts', label: 'YouTube Shorts', icon: '📹' },
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
  { id: 'x', label: 'X (Twitter)', icon: '🐦' },
] as const;

// Goal emphasis options (persona-tailored)
export const GOALS = {
  creator: [
    { id: 'viral', label: 'Viral video ideas' },
    { id: 'growth', label: 'Audience growth' },
    { id: 'monetization', label: 'Monetization opportunities' },
  ],
  agency: [
    { id: 'campaigns', label: 'Campaign angles' },
    { id: 'audiences', label: 'Audience insights' },
    { id: 'competitors', label: 'Competitive analysis' },
  ],
  pr: [
    { id: 'narrative', label: 'Brand narrative' },
    { id: 'crisis', label: 'Crisis prevention' },
    { id: 'opportunities', label: 'PR opportunities' },
  ],
  manager: [
    { id: 'talent-growth', label: 'Talent growth' },
    { id: 'brand-deals', label: 'Brand partnerships' },
    { id: 'content-strategy', label: 'Content strategy' },
  ],
  founder: [
    { id: 'product', label: 'Product scouting' },
    { id: 'market', label: 'Market opportunities' },
    { id: 'customer', label: 'Customer insights' },
  ],
} as const;

// Subscription plans
export const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0, // TBD
    features: [
      '1 upload/week',
      '24h dashboard delay',
      'Limited watchlist (10 items)',
      'Standard alerts',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 0, // TBD
    features: [
      '10 uploads/week',
      'Real-time dashboard',
      'Unlimited watchlist',
      'Advanced alerts',
      'Export reports',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 0, // TBD
    features: [
      'Unlimited uploads',
      'Priority processing',
      'Team seats',
      'API access (read-only)',
      'Custom categories',
    ],
  },
] as const;

// Status indicators
export const TREND_STATUS = {
  LOW_SATURATION: { label: 'Low Saturation', color: 'green' },
  HIGH_NOVELTY: { label: 'High Novelty', color: 'purple' },
  CROSS_PLATFORM: { label: 'Cross-Platform', color: 'blue' },
  HEATING_UP: { label: 'Heating Up', color: 'red' },
  STABLE: { label: 'Stable', color: 'gray' },
  COOLING: { label: 'Cooling', color: 'blue' },
} as const;

// Evidence source types
export const EVIDENCE_SOURCES = {
  reddit: { label: 'Reddit', icon: '🔗' },
  tiktok: { label: 'TikTok', icon: '📱' },
  youtube: { label: 'YouTube', icon: '▶️' },
  twitter: { label: 'X', icon: '🐦' },
  instagram: { label: 'Instagram', icon: '📷' },
} as const;

// Type exports
export type Category = typeof CATEGORIES[number];
export type Persona = typeof PERSONAS[number];
export type Platform = typeof PLATFORMS[number];
export type Plan = typeof PLANS[number];
export type TrendStatusKey = keyof typeof TREND_STATUS;
export type EvidenceSourceKey = keyof typeof EVIDENCE_SOURCES;