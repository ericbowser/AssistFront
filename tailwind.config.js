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
            backgroundImage: {
                'custom-image': "url('./images/back.png')",
            }
        },
    },
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
    ],
}

