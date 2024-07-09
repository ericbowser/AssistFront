/** @type {import('tailwindcss').Config} */
module.exports = {
  dark: 'class',
  content: [
      './src/**/*.{js}',
      './src/Api/*.{js}',
      './src/*.{js}',
      './src/components/*.{js}'
  ],
  theme: {
    extend: {
      colors: {
      }
    },
  },
  plugins: [],
}

