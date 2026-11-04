import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FCFBF8",
          100: "#FAF8F5",
          200: "#F5F2EB",
          300: "#EAE5D9",
          400: "#DDD6C4",
        },
        forest: {
          50: "#F2F7F2",
          100: "#E2EDE2",
          500: "#3B6939",
          600: "#2D5A27",
          700: "#234E24",
          800: "#1C3E1D",
        },
        terracotta: {
          50: "#FEF6F3",
          100: "#FCE9E2",
          500: "#D9683E",
          600: "#C85A32",
          700: "#A94723",
        },
        charcoal: {
          500: "#4B5563",
          600: "#374151",
          700: "#1F2937",
          800: "#111827",
          900: "#0F172A",
        },
        sand: {
          100: "#F7F5EE",
          200: "#ECE7DA",
          300: "#DFD9C7",
          border: "#E7E2D5",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

