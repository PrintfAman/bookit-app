/** @type {import('tailwindcss').Config} */
export default {
  content: [
  "./frontend/index.html",
  "./frontend/src/**/*.{js,ts,jsx,tsx}",
],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FCD34D',
          dark: '#F59E0B',
        },
        secondary: {
          DEFAULT: '#1F2937',
          light: '#374151',
        },
      },
    },
  },
  plugins: [],
}