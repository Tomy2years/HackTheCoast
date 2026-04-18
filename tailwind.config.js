/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          200: '#66A3D8',
          400: '#0052A2',
          500: '#00498D',
          600: '#02386E',
          900: '#00264D',
        }
      }
    },
  },
  plugins: [],
}

