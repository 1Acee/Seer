// File: contexts/ThemeContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage and system preference
  useEffect(() => {
    setMounted(true);
    
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Fall back to system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches 
        ? "dark" 
        : "light";
      setTheme(systemTheme);
    }
  }, []);

  // Apply theme to document root
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
      // Update CSS variables for dark mode
      root.style.setProperty("--bg-primary", "28, 25, 23");      // stone-950
      root.style.setProperty("--bg-secondary", "74, 67, 59");    // stone-900
      root.style.setProperty("--bg-tertiary", "102, 92, 81");    // stone-800
      root.style.setProperty("--text-primary", "250, 248, 246"); // stone-100
      root.style.setProperty("--text-secondary", "232, 226, 219"); // stone-300
      root.style.setProperty("--text-tertiary", "184, 171, 155"); // stone-500
      root.style.setProperty("--border", "102, 92, 81");         // stone-800
      root.style.setProperty("--card-bg", "74, 67, 59");         // stone-900
    } else {
      root.classList.remove("dark");
      // Reset to light mode variables
      root.style.setProperty("--bg-primary", "253, 252, 251");   // stone-50
      root.style.setProperty("--bg-secondary", "250, 248, 246"); // stone-100
      root.style.setProperty("--bg-tertiary", "245, 241, 237");  // stone-200
      root.style.setProperty("--text-primary", "28, 25, 23");    // stone-950
      root.style.setProperty("--text-secondary", "102, 92, 81"); // stone-800
      root.style.setProperty("--text-tertiary", "154, 141, 125"); // stone-600
      root.style.setProperty("--border", "232, 226, 219");       // stone-300
      root.style.setProperty("--card-bg", "255, 255, 255");      // white
    }
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}