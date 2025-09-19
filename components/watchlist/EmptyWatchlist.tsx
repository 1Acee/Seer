'use client';

import Link from 'next/link';

export default function EmptyWatchlist() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6 opacity-10">◯</div>
        <h2 className="text-2xl font-light text-stone-900 dark:text-stone-100 mb-3">
          Your watchlist is empty
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mb-8">
          Start tracking trends by adding them from the All Trends page. 
          Keep an eye on the trends that matter most to your content strategy.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/dashboard/trends"
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full hover:scale-105 transition-transform"
          >
            <span>⊙</span>
            Browse All Trends
          </Link>
          
          <div className="mt-8 p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
            <h3 className="font-medium text-stone-900 dark:text-stone-100 mb-3">
              How the Watchlist works:
            </h3>
            <ul className="text-sm text-left text-stone-600 dark:text-stone-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#FF6B6B] mt-0.5">◉</span>
                <span>Add trends you want to monitor closely</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF6B6B] mt-0.5">◉</span>
                <span>Set priority levels (High, Medium, Low)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF6B6B] mt-0.5">◉</span>
                <span>Get alerts when trends heat up or cool down</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF6B6B] mt-0.5">◉</span>
                <span>Track performance over time</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}