// File: app/(main)/dashboard/layout.tsx
"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const Sidebar = dynamic(() => import("@/components/dashboard/Sidebar"), { 
  ssr: false 
});
const TopNav = dynamic(() => import("@/components/dashboard/TopNav"), { 
  ssr: false 
});

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider>
      <WatchlistProvider>
        <div className="min-h-screen" style={{ background: 'var(--bg-color, rgb(237, 228, 221))' }}>
          <Sidebar />
          <TopNav />
          <main className="ml-72 pt-20">
            {children}
          </main>
        </div>
      </WatchlistProvider>
    </ThemeProvider>
  );
}