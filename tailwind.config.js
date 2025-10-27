// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(alert|toggle|button|ripple|spinner).js"
],
  theme: {
    extend: {
      fontFamily: {
        main: ["var(--font-main)", "sans-serif"],
      },
      colors: {
        folder: {
          blue: "#A5D8FF",
          green: "#B2F2BB",
          peach: "#FFD8A8",
          lavender: "#D0BFFF",
          beige: "#FFE8CC",
          pink: "#F3C0C6",
          yellow: "#FFF3BF",
          teal: "#96E6B3",
          gray: "#C5D8E8",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};