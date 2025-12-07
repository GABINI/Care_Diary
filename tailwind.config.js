/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3e2',
          100: '#fde4b8',
          200: '#fccf8e',
          300: '#fbb964',
          400: '#faa33a',
          500: '#f98d10',
          600: '#c7700d',
          700: '#95530a',
          800: '#633607',
          900: '#311903',
        },
      },
    },
  },
  plugins: [],
}

