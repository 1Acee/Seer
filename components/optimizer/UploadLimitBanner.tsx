'use client';

interface UploadLimitBannerProps {
  used: number;
  limit: number;
  plan: string;
}

export default function UploadLimitBanner({ used, limit, plan }: UploadLimitBannerProps) {
  const remaining = limit === Infinity ? 'Unlimited' : limit - used;
  const percentage = limit === Infinity ? 0 : (used / limit) * 100;
  
  const getPlanColor = () => {
    if (plan === 'elite') return 'bg-gradient-to-r from-purple-500 to-pink-500';
    if (plan === 'pro') return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    return 'bg-gradient-to-r from-stone-400 to-stone-500';
  };

  const getPlanLabel = () => {
    if (plan === 'elite') return 'Elite';
    if (plan === 'pro') return 'Pro';
    return 'Basic';
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 min-w-[200px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getPlanColor()}`} />
          <span className="text-xs font-medium text-stone-700 dark:text-stone-300">
            {getPlanLabel()} Plan
          </span>
        </div>
        {plan === 'basic' && (
          <button className="text-xs text-accent hover:text-accent/80 transition-colors">
            Upgrade
          </button>
        )}
      </div>
      
      <div className="mb-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-light text-stone-900 dark:text-stone-100">
            {used}
          </span>
          <span className="text-sm text-stone-500">
            / {limit === Infinity ? '∞' : limit}
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          {remaining === 'Unlimited' ? 'Unlimited uploads' : `${remaining} remaining this week`}
        </p>
      </div>

      {limit !== Infinity && (
        <div className="h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              percentage > 80 ? 'bg-red-500' :
              percentage > 50 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {percentage >= 100 && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-2">
          Upload limit reached. Resets Monday.
        </p>
      )}
    </div>
  );
}