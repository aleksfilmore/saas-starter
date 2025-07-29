import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enables dark mode via .dark class
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        primary: {
          DEFAULT: "#ec4899", // Pink-500
          dark: "#be185d",    // Pink-800
          light: "#f472b6",   // Pink-400
        },
        secondary: {
          DEFAULT: "#6366f1", // Indigo-500
          dark: "#3730a3",    // Indigo-800
          light: "#a5b4fc",   // Indigo-300
        },
        card: "#0a0d14",
        "card-foreground": "#f3f4f6",
        border: "#23272f",
        background: "#09090b",
        muted: "#6b7280",
        accent: "#22d3ee", // Cyan-400
        error: "#ef4444",  // Red-500
        success: "#22c55e", // Green-500
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Poppins", "Inter", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      screens: {
        xs: "400px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1800px", // Custom extra large
      },
      boxShadow: {
        card: "0 4px 32px 0 rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};
export default config;