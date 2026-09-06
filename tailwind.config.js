/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          accent: '#0f172a',
          muted: '#64748b',
        },
      },
      fontFamily: {
        playfair: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'shimmer': 'shimmer 4s linear infinite',
        'fadeInUp': 'fadeInUp 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
