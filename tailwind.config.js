/** @type {import('tailwindcss').Config} */
module.exports = {
    dark: 'class',
    content: [
      './src/*.svg',
        './src/**/*.js',
        './src/api/*.js',
        './src/*.js',
        './src/components/*.js',
      './src/assets/*.svg'
    ],
    theme: {
        extend: {
            colors: {
                white: '#ffffff',
                green: '#008000',
                turquoise: '#40e0d0',
            },
              backgroundImage: {
                'back': "url('/src/assets/circle-scatter-haikei.svg')",
              },
        },
    },
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
    ],
}

