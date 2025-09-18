import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Neutral Palette - Stone/Beige/Cream
        stone: {
          50: "#fdfcfb",   // Lightest - main backgrounds
          100: "#faf8f6",  // Very light backgrounds
          200: "#f5f1ed",  // Card backgrounds
          300: "#e8e2db",  // Borders, dividers
          400: "#d4cbc0",  // Subtle borders
          500: "#b8ab9b",  // Muted text, icons
          600: "#9a8d7d",  // Secondary text
          700: "#7d7265",  // Body text
          800: "#665c51",  // Heading text
          900: "#4a433b",  // Dark headings
          950: "#1c1917",  // Darkest text, primary buttons
        },
        
        // Accent Colors
        neon: {
          50: "#feffeb",
          100: "#fdffc2",
          200: "#fcff88",
          300: "#f8ff44",
          400: "#f0ff0b",
          500: "#bfff00",  // Primary neon
          600: "#99cc00",  // Dimmed neon
          700: "#7aa600",  // Darker neon
          800: "#628300",
          900: "#526d07",
          950: "#2d3e00",
        },
        
        // Electric Blue (from your gradients)
        electric: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#6366f1",  // Primary electric blue
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        
        // Purple (from your gradients)
        amethyst: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",  // Primary purple
          600: "#9333ea",
          700: "#7c3aed",
          800: "#6b21a8",
          900: "#581c87",
          950: "#3b0764",
        },
        
        // Semantic Colors
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
      },
      
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "ui-serif", "Georgia", "serif"],
        display: ["Didot", "Playfair Display", "ui-serif", "Georgia", "serif"],
      },
      
      fontSize: {
        // Matching your design spec
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["0.875rem", { lineHeight: "1.5rem" }], // 14px base per spec
        lg: ["1rem", { lineHeight: "1.5rem" }],      // 16px
        xl: ["1.25rem", { lineHeight: "1.75rem" }],  // 20px H2 start
        "2xl": ["1.5rem", { lineHeight: "2rem" }],   // 24px H2 end
        "3xl": ["1.75rem", { lineHeight: "2.25rem" }],
        "4xl": ["2rem", { lineHeight: "2.5rem" }],   // 32px H1 end
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      
      spacing: {
        // 8px grid system
        "0.5": "2px",    // 0.125rem
        "1": "4px",      // 0.25rem  
        "1.5": "6px",    // 0.375rem
        "2": "8px",      // 0.5rem - base unit
        "2.5": "10px",   // 0.625rem
        "3": "12px",     // 0.75rem
        "3.5": "14px",   // 0.875rem
        "4": "16px",     // 1rem
        "5": "20px",     // 1.25rem
        "6": "24px",     // 1.5rem
        "7": "28px",     // 1.75rem
        "8": "32px",     // 2rem
        "9": "36px",     // 2.25rem
        "10": "40px",    // 2.5rem
        "11": "44px",    // 2.75rem - minimum touch target
        "12": "48px",    // 3rem
        "14": "56px",    // 3.5rem
        "16": "64px",    // 4rem
        "18": "72px",    // 4.5rem
        "20": "80px",    // 5rem
        "24": "96px",    // 6rem
        "28": "112px",   // 7rem
        "32": "128px",   // 8rem
        "36": "144px",   // 9rem
        "40": "160px",   // 10rem
        "44": "176px",   // 11rem
        "48": "192px",   // 12rem
        "52": "208px",   // 13rem
        "56": "224px",   // 14rem
        "60": "240px",   // 15rem
        "64": "256px",   // 16rem
        "72": "288px",   // 18rem
        "80": "320px",   // 20rem
        "96": "384px",   // 24rem
        "120": "480px",  // 30rem
      },
      
      borderRadius: {
        "none": "0",
        "sm": "0.125rem",    // 2px
        "DEFAULT": "0.25rem", // 4px
        "md": "0.375rem",    // 6px
        "lg": "0.5rem",      // 8px
        "xl": "0.75rem",     // 12px
        "2xl": "1rem",       // 16px - card radius
        "3xl": "1.5rem",     // 24px
        "4xl": "2rem",       // 32px - large cards
        "full": "9999px",
      },
      
      boxShadow: {
        // Subtle shadows for glass effect
        "glass-sm": "0 2px 8px rgba(28, 25, 23, 0.04)",
        "glass": "0 8px 32px rgba(28, 25, 23, 0.06)",
        "glass-lg": "0 20px 40px rgba(28, 25, 23, 0.08)",
        "glass-xl": "0 30px 60px rgba(28, 25, 23, 0.10)",
        
        // Neon glows
        "neon-sm": "0 0 10px rgba(191, 255, 0, 0.3)",
        "neon": "0 0 20px rgba(191, 255, 0, 0.4)",
        "neon-lg": "0 0 40px rgba(191, 255, 0, 0.5)",
        
        // Electric glows
        "electric-sm": "0 0 10px rgba(99, 102, 241, 0.3)",
        "electric": "0 0 20px rgba(99, 102, 241, 0.4)",
        "electric-lg": "0 0 40px rgba(99, 102, 241, 0.5)",
      },
      
      animation: {
        // Matching your motion spec (200-250ms)
        "fade-in": "fadeIn 0.25s ease-out forwards",
        "fade-out": "fadeOut 0.25s ease-out forwards",
        "slide-in": "slideIn 0.25s ease-out forwards",
        "slide-out": "slideOut 0.25s ease-out forwards",
        "scale-in": "scaleIn 0.25s ease-out forwards",
        "scale-out": "scaleOut 0.25s ease-out forwards",
        
        // Chart animations
        "draw-line": "drawLine 0.8s ease-out forwards",
        "fade-in-prediction": "fadeInPrediction 0.5s ease-out 0.8s forwards",
        
        // Hover effects
        "elevate": "elevate 0.2s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        
        // Loading states
        "spin-slow": "spin 3s linear infinite",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
      },
      
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideIn: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideOut: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-20px)", opacity: "0" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleOut: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        elevate: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-4px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "0.4" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(191, 255, 0, 0.2)" },
          "100%": { boxShadow: "0 0 40px rgba(191, 255, 0, 0.6)" },
        },
        drawLine: {
          "0%": { strokeDashoffset: "100%" },
          "100%": { strokeDashoffset: "0%" },
        },
        fadeInPrediction: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
      },
      
      backdropBlur: {
        xs: "2px",
      },
      
      // Custom utilities
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-electric": "linear-gradient(135deg, #6366f1, #a855f7)",
        "gradient-neon": "linear-gradient(135deg, #bfff00, #99cc00)",
        "gradient-stone": "linear-gradient(135deg, #fdfcfb, #f5f1ed, #e8e2db)",
        "gradient-dark": "linear-gradient(135deg, #1c1917, #4a433b)",
      },
      
      // Glass morphism utilities
      backdropFilter: {
        "glass": "blur(10px) saturate(180%)",
        "glass-heavy": "blur(20px) saturate(180%)",
      },
      
      // Custom container sizes
      maxWidth: {
        "8xl": "90rem",
        "9xl": "100rem",
      },
      
      // Screen sizes matching your breakpoints
      screens: {
        "xs": "475px",
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1536px",
        "3xl": "1920px",
      },
      
      // Letter spacing matching your design
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.3em", // For small caps and labels
      },
      
      // Line heights for better typography
      lineHeight: {
        "3": ".75rem",
        "4": "1rem",
        "5": "1.25rem",
        "6": "1.5rem",
        "7": "1.75rem",
        "8": "2rem",
        "9": "2.25rem",
        "10": "2.5rem",
      },
    },
  },
  plugins: [
    // You might want to add these plugins:
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
  ],
};

export default config;