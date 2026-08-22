/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0F172A',     // Deep Slate/Blue
          light: '#F8FAFC',    // Soft Off-White
          primary: '#1E3A8A',  // Deep Blue
          secondary: '#0EA5E9',// Sky Blue
          accent: '#F97316',   // Warm Sunset Orange
          success: '#10B981',  // Emerald Green
          warning: '#F59E0B',  // Amber Yellow
          danger: '#EF4444',   // Rose Red
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 10px -1px rgba(15, 23, 42, 0.03)',
        'premium-hover': '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
