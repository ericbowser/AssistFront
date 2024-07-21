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
            colors: {
                white: '#ffffff',
                green: '#008000',
                turquoise: '#40e0d0',
            },
            backgroundImage: {
                'custom-image': "url('./images/cool_bak.jpg')",
            }
        },
    },
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
    ],
}

