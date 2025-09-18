// File: app/(main)/dashboard/layout.tsx
"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";

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
    <div className="min-h-screen" style={{ background: 'rgb(237, 228, 221)' }}>
      <Sidebar />
      <TopNav />
      <main className="ml-72 pt-20">
        {children}
      </main>
    </div>
  );
}