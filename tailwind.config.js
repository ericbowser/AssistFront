/** @type {import('tailwindcss').Config} */
module.exports = {
    dark: 'class',
    content: [
        './src/**/*.js',
        './src/api/*.js',
        './src/*.js',
        './src/components/*.js'
    ],
    theme: {
        extend: {
            colors: {}
        },
    },
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
    ],
}

