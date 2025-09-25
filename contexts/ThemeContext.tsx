'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeConfig {
  accentColor: string;
  accentName: string;
  backgroundColor: 'beige' | 'stone' | 'slate';
  darkMode: boolean;
}

interface ThemeContextType extends ThemeConfig {
  setAccentColor: (color: string, name: string) => void;
  setBackgroundColor: (color: 'beige' | 'stone' | 'slate') => void;
  toggleDarkMode: () => void;
}

const ACCENT_COLORS = [
  { name: 'Coral', value: '#FF6B6B' },
  { name: 'Electric Blue', value: '#00D4FF' },
  { name: 'Neon Green', value: '#39FF14' },
  { name: 'Magenta', value: '#FF00FF' },
  { name: 'Cyan', value: '#00FFFF' },
  { name: 'Orange', value: '#FF8C00' },
  { name: 'Purple', value: '#8A2BE2' },
  { name: 'Pink', value: '#FF69B4' },
];

const BACKGROUND_THEMES = {
  beige: {
    name: 'Warm Beige',
    light: 'rgb(237, 228, 221)', // Your beloved coraley beige!
    dark: 'rgb(28, 25, 23)', // Warmer black
    lightText: 'rgb(245, 245, 244)', // Light text for dark mode
    darkText: 'rgb(28, 25, 23)', // Dark text for light mode
    // Additional color shades
    card: {
      light: 'rgba(255, 255, 255, 0.8)',
      dark: 'rgba(41, 37, 33, 0.5)'
    },
    muted: {
      light: 'rgb(214, 211, 209)',
      dark: 'rgb(68, 64, 60)'
    },
    border: {
      light: 'rgb(214, 211, 209)',
      dark: 'rgb(68, 64, 60)'
    },
    secondary: {
      light: 'rgb(245, 243, 241)',
      dark: 'rgb(41, 37, 33)'
    }
  },
  stone: {
    name: 'Cool Stone',
    light: 'rgb(250, 250, 249)', // stone-50
    dark: 'rgb(12, 10, 9)', // stone-950
    lightText: 'rgb(245, 245, 244)', // stone-100
    darkText: 'rgb(28, 25, 23)', // stone-900
    card: {
      light: 'rgba(255, 255, 255, 0.8)',
      dark: 'rgba(41, 37, 36, 0.5)'
    },
    muted: {
      light: 'rgb(214, 211, 209)', // stone-300
      dark: 'rgb(68, 64, 60)' // stone-700
    },
    border: {
      light: 'rgb(231, 229, 228)', // stone-200
      dark: 'rgb(68, 64, 60)' // stone-700
    },
    secondary: {
      light: 'rgb(245, 245, 244)', // stone-100
      dark: 'rgb(41, 37, 36)' // stone-800
    }
  },
  slate: {
    name: 'Modern Slate',
    light: 'rgb(248, 250, 252)', // slate-50
    dark: 'rgb(2, 6, 23)', // slate-950
    lightText: 'rgb(241, 245, 249)', // slate-100
    darkText: 'rgb(30, 41, 59)', // slate-800
    card: {
      light: 'rgba(255, 255, 255, 0.8)',
      dark: 'rgba(30, 41, 59, 0.5)'
    },
    muted: {
      light: 'rgb(203, 213, 225)', // slate-300
      dark: 'rgb(71, 85, 105)' // slate-600
    },
    border: {
      light: 'rgb(226, 232, 240)', // slate-200
      dark: 'rgb(71, 85, 105)' // slate-600
    },
    secondary: {
      light: 'rgb(241, 245, 249)', // slate-100
      dark: 'rgb(51, 65, 85)' // slate-700
    }
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>({
    accentColor: '#FF6B6B',
    accentName: 'Coral',
    backgroundColor: 'beige',
    darkMode: false
  });

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('seer-theme');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        setTheme(parsed);
        // Apply dark mode class
        if (parsed.darkMode) {
          document.documentElement.classList.add('dark');
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    }
  }, []);

  // Save theme and apply CSS variables whenever it changes
  useEffect(() => {
    localStorage.setItem('seer-theme', JSON.stringify(theme));
    
    const root = document.documentElement;
    const bgTheme = BACKGROUND_THEMES[theme.backgroundColor];
    
    // Apply accent color
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--accent', theme.accentColor); // Some components may use this
    
    // Apply background theme colors based on dark/light mode
    if (theme.darkMode) {
      // Dark mode colors
      root.style.setProperty('--background', bgTheme.dark);
      root.style.setProperty('--foreground', bgTheme.lightText);
      root.style.setProperty('--card', bgTheme.card.dark);
      root.style.setProperty('--card-foreground', bgTheme.lightText);
      root.style.setProperty('--muted', bgTheme.muted.dark);
      root.style.setProperty('--muted-foreground', 'rgb(163, 163, 163)');
      root.style.setProperty('--border', bgTheme.border.dark);
      root.style.setProperty('--secondary', bgTheme.secondary.dark);
      root.style.setProperty('--secondary-foreground', bgTheme.lightText);
      
      document.documentElement.classList.add('dark');
    } else {
      // Light mode colors
      root.style.setProperty('--background', bgTheme.light);
      root.style.setProperty('--foreground', bgTheme.darkText);
      root.style.setProperty('--card', bgTheme.card.light);
      root.style.setProperty('--card-foreground', bgTheme.darkText);
      root.style.setProperty('--muted', bgTheme.muted.light);
      root.style.setProperty('--muted-foreground', 'rgb(115, 115, 115)');
      root.style.setProperty('--border', bgTheme.border.light);
      root.style.setProperty('--secondary', bgTheme.secondary.light);
      root.style.setProperty('--secondary-foreground', bgTheme.darkText);
      
      document.documentElement.classList.remove('dark');
    }
    
    // Additional commonly used variables
    root.style.setProperty('--bg-color', theme.darkMode ? bgTheme.dark : bgTheme.light);
    root.style.setProperty('--text-color', theme.darkMode ? bgTheme.lightText : bgTheme.darkText);
    
    // Set accent with opacity variations (useful for hover states, etc.)
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    
    const rgb = hexToRgb(theme.accentColor);
    if (rgb) {
      root.style.setProperty('--accent-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
    
  }, [theme]);

  const setAccentColor = (color: string, name: string) => {
    setTheme(prev => ({ ...prev, accentColor: color, accentName: name }));
  };

  const setBackgroundColor = (color: 'beige' | 'stone' | 'slate') => {
    setTheme(prev => ({ ...prev, backgroundColor: color }));
  };

  const toggleDarkMode = () => {
    setTheme(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  return (
    <ThemeContext.Provider value={{
      ...theme,
      setAccentColor,
      setBackgroundColor,
      toggleDarkMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { ACCENT_COLORS, BACKGROUND_THEMES };