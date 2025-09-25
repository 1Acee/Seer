'use client';

import Link from 'next/link';

export default function EmptyWatchlist() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6 opacity-10">◯</div>
        <h2 className="text-2xl font-light text-foreground mb-3">
          Your watchlist is empty
        </h2>
        <p className="text-muted-foreground mb-8">
          Start tracking trends by adding them from the All Trends page. 
          Keep an eye on the trends that matter most to your content strategy.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/dashboard/trends"
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full hover:scale-105 transition-transform"
          >
            <span>⊙</span>
            Browse All Trends
          </Link>
          
          <div className="mt-8 p-6 bg-card rounded-2xl border border-border">
            <h3 className="font-medium text-foreground mb-3">
              How the Watchlist works:
            </h3>
            <ul className="text-sm text-left text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-color)] mt-0.5">◉</span>
                <span>Add trends you want to monitor closely</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-color)] mt-0.5">◉</span>
                <span>Set priority levels (High, Medium, Low)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-color)] mt-0.5">◉</span>
                <span>Get alerts when trends heat up or cool down</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent-color)] mt-0.5">◉</span>
                <span>Track performance over time</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}