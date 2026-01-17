const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
theme: {
  extend: {
    animation: {
      shimmer: "shimmer 4s linear infinite",
    },
    keyframes: {
      shimmer: {
        "0%": { backgroundPosition: "200% center" },
        "100%": { backgroundPosition: "-200% center" },
      },
    },
  },
},
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: "#191970",
            foreground: "#ffffff",
          },
          secondary: {
            DEFAULT: "#4169E1",
            foreground: "#ffffff",
          },
          success: {
            DEFAULT: "#00CED1",
            foreground: "#ffffff",
          },
          warning: {
            DEFAULT: "#FFD700",
            foreground: "#000000",
          },
          danger: {
            DEFAULT: "#FF4444",
            foreground: "#ffffff",
          }
        },
      },
    },
  })],
};