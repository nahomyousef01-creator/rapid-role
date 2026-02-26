/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
      },
      colors: {
        ink:   '#0f0f0f',
        paper: '#f7f5f0',
        cream: '#ede9e0',
        rust:  '#c94f2a',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.45s ease-out forwards',
      },
    },
  },
  plugins: [],
}
