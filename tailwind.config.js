/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        'safe-mobile': { 'raw': '(max-width: 390px)' },
      },
      spacing: {
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      maxWidth: {
        'screen-safe': 'calc(100vw - 2rem)',
        'mobile-safe': 'calc(100vw - 1rem)',
      },
      colors: {
        background: "rgb(8 15 32)", // Deeper dark blue
        foreground: "rgb(248 250 252)",
        primary: {
          DEFAULT: "rgb(236 72 153)", // Hot pink
          foreground: "rgb(248 250 252)",
        },
        secondary: {
          DEFAULT: "rgb(139 69 255)", // Vibrant purple
          foreground: "rgb(248 250 252)",
        },
        accent: {
          DEFAULT: "rgb(14 165 233)", // Electric blue
          foreground: "rgb(248 250 252)",
        },
        success: {
          DEFAULT: "rgb(34 197 94)", // Neon green
          foreground: "rgb(248 250 252)",
        },
        warning: {
          DEFAULT: "rgb(251 191 36)", // Bright yellow
          foreground: "rgb(15 23 42)",
        },
        muted: {
          DEFAULT: "rgb(55 65 81)",
          foreground: "rgb(156 163 175)",
        },
        card: {
          DEFAULT: "rgb(15 25 45)", // Slightly lighter than background
          foreground: "rgb(241 245 249)",
        },
        border: "rgb(51 65 85)",
        input: "rgb(30 41 59)",
        ring: "rgb(236 72 153)",
        destructive: {
          DEFAULT: "rgb(239 68 68)",
          foreground: "rgb(248 250 252)",
        },
        // Glitch-core palette
        'glitch-pink': "rgb(255 20 147)", // Deep pink
        'glitch-cyan': "rgb(0 255 255)", // Neon cyan
        'glitch-purple': "rgb(138 43 226)", // Blue violet
        'glitch-lime': "rgb(50 255 50)", // Electric lime
        'glitch-orange': "rgb(255 165 0)", // Vibrant orange
        'glitch-fuchsia': "rgb(217 70 239)", // Bright fuchsia
        'glitch-blue': "rgb(59 130 246)", // Electric blue
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      boxShadow: {
        'neon-pink': '0 0 20px rgb(236 72 153 / 0.5)',
        'neon-blue': '0 0 20px rgb(14 165 233 / 0.5)',
        'neon-purple': '0 0 20px rgb(139 69 255 / 0.5)',
        'glitch': '0 0 10px rgb(255 20 147 / 0.3), 0 0 20px rgb(0 255 255 / 0.2)',
      },
      scale: {
        '102': '1.02',
        '105': '1.05',
        '110': '1.1',
        '115': '1.15',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glitch': 'glitch 2s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glitch-gradient': 'linear-gradient(45deg, rgb(236 72 153), rgb(139 69 255), rgb(14 165 233))',
        'cyber-gradient': 'linear-gradient(135deg, rgb(8 15 32) 0%, rgb(15 25 45) 50%, rgb(30 41 59) 100%)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};
