import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1600px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'Cambria', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'luxury': '0.25em',
        'editorial': '0.15em',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          muted: "hsl(var(--accent-muted))",
          glow: "hsl(var(--accent-glow))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          muted: "hsl(var(--gold-muted))",
          glow: "hsl(var(--gold-glow))",
        },
        champagne: {
          DEFAULT: "hsl(var(--champagne))",
          foreground: "hsl(var(--champagne-foreground))",
        },
        silver: {
          DEFAULT: "hsl(var(--silver))",
          muted: "hsl(var(--silver-muted))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(60px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "blur-in": {
          "0%": { opacity: "0", filter: "blur(20px)" },
          "100%": { opacity: "1", filter: "blur(0)" },
        },
        "text-reveal": {
          "0%": { 
            opacity: "0", 
            transform: "translateY(100%)",
            filter: "blur(10px)"
          },
          "100%": { 
            opacity: "1", 
            transform: "translateY(0)",
            filter: "blur(0)"
          },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 40px hsl(var(--accent) / 0.3)",
          },
          "50%": { 
            boxShadow: "0 0 80px hsl(var(--accent) / 0.6)",
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "drift": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(10px, -10px) rotate(2deg)" },
          "50%": { transform: "translate(0, -20px) rotate(0deg)" },
          "75%": { transform: "translate(-10px, -10px) rotate(-2deg)" },
        },
        "number-increment": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in-up": "fade-in-up 1s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "scale-in": "scale-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-in-right": "slide-in-right 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-in-left": "slide-in-left 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "blur-in": "blur-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "text-reveal": "text-reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "drift": "drift 8s ease-in-out infinite",
        "number-increment": "number-increment 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;