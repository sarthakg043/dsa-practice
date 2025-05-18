/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define your custom colors here
        background: {
          DEFAULT: "#ffffff",
          dark: "#0f172a",
        },
        foreground: {
          DEFAULT: "#0f172a",
          dark: "#f8fafc", 
        },
      },
    },
  },
  plugins: [],
}
