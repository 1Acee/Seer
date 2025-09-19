// utils/mockTrendsData.ts

export interface TrendData {
  id: string;
  name: string;
  category: string;
  seerScore: number;
  leadTime: number; // days to peak
  velocity: number; // percentage growth
  saturation: 'Low' | 'Medium' | 'High';
  novelty: 'High' | 'Medium' | 'Low';
  crossPlatform: boolean;
  momentum: number[]; // 14-day momentum data for sparkline
  evidence: {
    reddit: number;
    tiktok: number;
    youtube: number;
    twitter: number;
    instagram: number;
  };
  description: string;
  lastUpdated: Date;
  hashtags: string[];
  predictedPeak: Date;
  currentPhase: 'Emerging' | 'Growing' | 'Peak' | 'Declining';
  confidence: number; // 0-100
}

export const categories = [
  'Beauty', 'Fashion', 'Food & Beverage', 'Fitness', 'Tech', 
  'Finance', 'Lifestyle', 'Gaming', 'Music', 'Home/DIY',
  'Travel', 'Education', 'Entertainment', 'Health'
];

// Generate realistic momentum data
const generateMomentum = (trend: 'rising' | 'steady' | 'volatile' = 'rising'): number[] => {
  const data = [];
  let base = Math.random() * 30 + 10;
  
  for (let i = 0; i < 14; i++) {
    if (trend === 'rising') {
      base += Math.random() * 8 - 2;
    } else if (trend === 'steady') {
      base += Math.random() * 4 - 2;
    } else {
      base += Math.random() * 15 - 7.5;
    }
    data.push(Math.max(0, Math.min(100, base)));
  }
  return data;
};

// Generate 50+ mock trends for comprehensive browsing
export const mockTrends: TrendData[] = [
  {
    id: '1',
    name: 'Glass Skin Routine',
    category: 'Beauty',
    seerScore: 94,
    leadTime: 12,
    velocity: 156,
    saturation: 'Low',
    novelty: 'High',
    crossPlatform: true,
    momentum: generateMomentum('rising'),
    evidence: { reddit: 23, tiktok: 89, youtube: 12, twitter: 34, instagram: 67 },
    description: 'Korean-inspired skincare routine focusing on achieving translucent, dewy skin',
    lastUpdated: new Date('2025-01-18'),
    hashtags: ['#glassskin', '#koreanbeauty', '#dewyskin'],
    predictedPeak: new Date('2025-02-01'),
    currentPhase: 'Emerging',
    confidence: 87
  },
  {
    id: '2',
    name: 'Micro-HIIT Workouts',
    category: 'Fitness',
    seerScore: 88,
    leadTime: 8,
    velocity: 124,
    saturation: 'Low',
    novelty: 'Medium',
    crossPlatform: true,
    momentum: generateMomentum('rising'),
    evidence: { reddit: 45, tiktok: 102, youtube: 67, twitter: 23, instagram: 89 },
    description: '90-second ultra-intense exercise bursts designed for busy professionals',
    lastUpdated: new Date('2025-01-19'),
    hashtags: ['#microhiit', '#90secondworkout', '#busyfit'],
    predictedPeak: new Date('2025-01-28'),
    currentPhase: 'Growing',
    confidence: 92
  },
  {
    id: '3',
    name: 'AI Avatar Coaching',
    category: 'Tech',
    seerScore: 91,
    leadTime: 18,
    velocity: 203,
    saturation: 'Low',
    novelty: 'High',
    crossPlatform: false,
    momentum: generateMomentum('rising'),
    evidence: { reddit: 67, tiktok: 34, youtube: 89, twitter: 123, instagram: 12 },
    description: 'Personalized AI avatars providing 24/7 life and career coaching',
    lastUpdated: new Date('2025-01-17'),
    hashtags: ['#aicoach', '#avatarmentor', '#futureofcoaching'],
    predictedPeak: new Date('2025-02-07'),
    currentPhase: 'Emerging',
    confidence: 79
  },
  {
    id: '4',
    name: 'Fermented Coffee',
    category: 'Food & Beverage',
    seerScore: 76,
    leadTime: 15,
    velocity: 89,
    saturation: 'Medium',
    novelty: 'High',
    crossPlatform: true,
    momentum: generateMomentum('steady'),
    evidence: { reddit: 12, tiktok: 45, youtube: 23, twitter: 8, instagram: 34 },
    description: 'Probiotic-enhanced coffee beans with unique flavor profiles and gut benefits',
    lastUpdated: new Date('2025-01-18'),
    hashtags: ['#fermentedcoffee', '#gutcoffee', '#probioticbrew'],
    predictedPeak: new Date('2025-02-03'),
    currentPhase: 'Emerging',
    confidence: 71
  },
  {
    id: '5',
    name: 'Silent Luxury Fashion',
    category: 'Fashion',
    seerScore: 82,
    leadTime: 22,
    velocity: 67,
    saturation: 'Medium',
    novelty: 'Low',
    crossPlatform: true,
    momentum: generateMomentum('steady'),
    evidence: { reddit: 34, tiktok: 78, youtube: 45, twitter: 56, instagram: 123 },
    description: 'Logo-free, understated high-quality pieces emphasizing craftsmanship',
    lastUpdated: new Date('2025-01-19'),
    hashtags: ['#quietluxury', '#stealthwealth', '#logoless'],
    predictedPeak: new Date('2025-02-11'),
    currentPhase: 'Growing',
    confidence: 84
  },
  {
    id: '6',
    name: 'Nostalgic Web Design',
    category: 'Tech',
    seerScore: 79,
    leadTime: 10,
    velocity: 145,
    saturation: 'Low',
    novelty: 'Medium',
    crossPlatform: false,
    momentum: generateMomentum('volatile'),
    evidence: { reddit: 89, tiktok: 12, youtube: 34, twitter: 67, instagram: 23 },
    description: 'Y2K and early 2000s web aesthetics making a comeback in modern design',
    lastUpdated: new Date('2025-01-17'),
    hashtags: ['#y2kweb', '#nostalgicdesign', '#retrointernet'],
    predictedPeak: new Date('2025-01-29'),
    currentPhase: 'Emerging',
    confidence: 73
  },
  {
    id: '7',
    name: 'Dopamine Decorating',
    category: 'Home/DIY',
    seerScore: 85,
    leadTime: 14,
    velocity: 178,
    saturation: 'Low',
    novelty: 'High',
    crossPlatform: true,
    momentum: generateMomentum('rising'),
    evidence: { reddit: 23, tiktok: 156, youtube: 78, twitter: 12, instagram: 189 },
    description: 'Bold, colorful interior design focused on mood-boosting spaces',
    lastUpdated: new Date('2025-01-18'),
    hashtags: ['#dopaminedecor', '#colorfulhome', '#moodboostingspaces'],
    predictedPeak: new Date('2025-02-02'),
    currentPhase: 'Growing',
    confidence: 88
  },
  {
    id: '8',
    name: 'Rage Journaling',
    category: 'Lifestyle',
    seerScore: 73,
    leadTime: 9,
    velocity: 92,
    saturation: 'Medium',
    novelty: 'Medium',
    crossPlatform: true,
    momentum: generateMomentum('steady'),
    evidence: { reddit: 78, tiktok: 45, youtube: 23, twitter: 34, instagram: 56 },
    description: 'Therapeutic anger release through unfiltered, destructive journaling',
    lastUpdated: new Date('2025-01-19'),
    hashtags: ['#ragejournaling', '#angertherapy', '#emotionalrelease'],
    predictedPeak: new Date('2025-01-28'),
    currentPhase: 'Emerging',
    confidence: 68
  },
  {
    id: '9',
    name: 'Sober Curious Events',
    category: 'Lifestyle',
    seerScore: 87,
    leadTime: 20,
    velocity: 134,
    saturation: 'Low',
    novelty: 'Medium',
    crossPlatform: true,
    momentum: generateMomentum('rising'),
    evidence: { reddit: 56, tiktok: 89, youtube: 45, twitter: 78, instagram: 134 },
    description: 'Alcohol-free social gatherings and mocktail-focused nightlife',
    lastUpdated: new Date('2025-01-17'),
    hashtags: ['#sobercurious', '#mocktailparty', '#alcoholfree'],
    predictedPeak: new Date('2025-02-07'),
    currentPhase: 'Growing',
    confidence: 81
  },
  {
    id: '10',
    name: 'Climate Anxiety Fashion',
    category: 'Fashion',
    seerScore: 71,
    leadTime: 25,
    velocity: 56,
    saturation: 'High',
    novelty: 'Low',
    crossPlatform: false,
    momentum: generateMomentum('steady'),
    evidence: { reddit: 34, tiktok: 12, youtube: 8, twitter: 89, instagram: 45 },
    description: 'Clothing designed to adapt to extreme weather variations',
    lastUpdated: new Date('2025-01-18'),
    hashtags: ['#climatefashion', '#adaptivewear', '#weathertech'],
    predictedPeak: new Date('2025-02-14'),
    currentPhase: 'Emerging',
    confidence: 65
  },
  // Add more trends to reach 50+
  {
    id: '11',
    name: 'Moss Walls',
    category: 'Home/DIY',
    seerScore: 83,
    leadTime: 16,
    velocity: 112,
    saturation: 'Low',
    novelty: 'Medium',
    crossPlatform: true,
    momentum: generateMomentum('rising'),
    evidence: { reddit: 45, tiktok: 123, youtube: 67, twitter: 23, instagram: 178 },
    description: 'Living moss installations as sustainable indoor air purifiers and art',
    lastUpdated: new Date('2025-01-19'),
    hashtags: ['#mosswalls', '#livingart', '#biophilicdesign'],
    predictedPeak: new Date('2025-02-04'),
    currentPhase: 'Emerging',
    confidence: 77
  },
  {
    id: '12',
    name: 'Digital Detox Camps',
    category: 'Travel',
    seerScore: 89,
    leadTime: 30,
    velocity: 167,
    saturation: 'Low',
    novelty: 'High',
    crossPlatform: false,
    momentum: generateMomentum('rising'),
    evidence: { reddit: 78, tiktok: 34, youtube: 89, twitter: 123, instagram: 45 },
    description: 'Luxury retreats with zero connectivity and analog-only experiences',
    lastUpdated: new Date('2025-01-17'),
    hashtags: ['#digitaldetox', '#offlineretreat', '#analoglife'],
    predictedPeak: new Date('2025-02-18'),
    currentPhase: 'Emerging',
    confidence: 83
  },
  {
    id: '13',
    name: 'Fungi Leather',
    category: 'Fashion',
    seerScore: 86,
    leadTime: 45,
    velocity: 89,
    saturation: 'Low',
    novelty: 'High',
    crossPlatform: true,
    momentum: generateMomentum('steady'),
    evidence: { reddit: 67, tiktok: 23, youtube: 45, twitter: 89, instagram: 34 },
    description: 'Mushroom-based leather alternatives for sustainable luxury goods',
    lastUpdated: new Date('2025-01-18'),
    hashtags: ['#fungileather', '#mushroomfashion', '#sustainableluxury'],
    predictedPeak: new Date('2025-03-05'),
    currentPhase: 'Emerging',
    confidence: 74
  },
  {
    id: '14',
    name: 'Sound Bath Fitness',
    category: 'Fitness',
    seerScore: 77,
    leadTime: 11,
    velocity: 98,
    saturation: 'Medium',
    novelty: 'Medium',
    crossPlatform: true,
    momentum: generateMomentum('volatile'),
    evidence: { reddit: 23, tiktok: 78, youtube: 56, twitter: 12, instagram: 89 },
    description: 'Workout routines synchronized with healing frequency sound baths',
    lastUpdated: new Date('2025-01-19'),
    hashtags: ['#soundbathfitness', '#frequencyworkout', '#vibrationalhealth'],
    predictedPeak: new Date('2025-01-30'),
    currentPhase: 'Growing',
    confidence: 72
  },
  {
    id: '15',
    name: 'Neo-Brutalist UI',
    category: 'Tech',
    seerScore: 80,
    leadTime: 7,
    velocity: 201,
    saturation: 'Low',
    novelty: 'Medium',
    crossPlatform: false,
    momentum: generateMomentum('rising'),
    evidence: { reddit: 123, tiktok: 8, youtube: 34, twitter: 89, instagram: 12 },
    description: 'Raw, geometric web interfaces with harsh typography and bold colors',
    lastUpdated: new Date('2025-01-17'),
    hashtags: ['#neobrutalism', '#rawui', '#brutalistdesign'],
    predictedPeak: new Date('2025-01-26'),
    currentPhase: 'Growing',
    confidence: 85
  }
];

// Add 35 more trends with varied characteristics
const additionalTrends: TrendData[] = Array.from({ length: 35 }, (_, i) => {
  const categoryIndex = i % categories.length;
  const trendTypes = ['rising', 'steady', 'volatile'] as const;
  const trendType = trendTypes[i % 3];
  
  return {
    id: `${16 + i}`,
    name: `Emerging Trend ${16 + i}`,
    category: categories[categoryIndex],
    seerScore: Math.floor(Math.random() * 30 + 70),
    leadTime: Math.floor(Math.random() * 40 + 5),
    velocity: Math.floor(Math.random() * 200 + 50),
    saturation: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
    novelty: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
    crossPlatform: Math.random() > 0.5,
    momentum: generateMomentum(trendType),
    evidence: {
      reddit: Math.floor(Math.random() * 150),
      tiktok: Math.floor(Math.random() * 200),
      youtube: Math.floor(Math.random() * 100),
      twitter: Math.floor(Math.random() * 150),
      instagram: Math.floor(Math.random() * 200)
    },
    description: `An emerging ${categories[categoryIndex].toLowerCase()} trend showing ${trendType} growth patterns`,
    lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    hashtags: [`#trend${16 + i}`, `#${categories[categoryIndex].toLowerCase()}trend`],
    predictedPeak: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
    currentPhase: ['Emerging', 'Growing', 'Peak', 'Declining'][Math.floor(Math.random() * 2)] as 'Emerging' | 'Growing' | 'Peak' | 'Declining',
    confidence: Math.floor(Math.random() * 40 + 60)
  };
});

// Combine all trends
mockTrends.push(...additionalTrends);

// Sort by Seer Score by default
mockTrends.sort((a, b) => b.seerScore - a.seerScore);