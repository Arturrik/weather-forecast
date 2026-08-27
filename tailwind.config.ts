import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          DEFAULT: "#0B0F19",
          light: "#1a1f2e",
        },
      },
      fontFamily: {
        sans: ["Commissioner", "system-ui", "sans-serif"],
        display: ["Commissioner", "system-ui", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      boxShadow: {
        "glow-blue": "0 0 30px rgba(59, 130, 246, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
