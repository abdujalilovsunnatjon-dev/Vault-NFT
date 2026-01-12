/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        surface: "#151515",
        "surface-light": "#1E1E1E",
        border: "#2A2A2A",

        primary: {
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
        },

        accent: "#EC4899",
      },
    },
  },
  plugins: [],
}
