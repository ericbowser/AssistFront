const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); //to access built-in plugins
const dotenv = require('dotenv').config();

console.log('Node env: ', process.env.NODE_ENV)
console.log('Hosted port: ', process.env.PORT)

const port = process.env.PORT || 3000
const environment = process.env.NODE_ENV || 'production'

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, "./build/"),
        filename: 'bundle.js',
    },
    devtool: "eval-source-map",
    stats: {
        errorDetails: true,
        warnings: true
    },
    devServer: {
        historyApiFallback: true,
        open: true,
        port: port,
        host: 'localhost'
    },
    mode: environment,
    resolve: {
        fallback: {
            os: require.resolve("os-browserify/browser"),
            path: require.resolve("path-browserify"),
            crypto: false
        },
        extensions: [".jsx", ".js"]
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
            }
        },
        {
            test: /\.css$/i,
            use: {
                loader: "css-loader"
            }
        },
            {
                test: /\.txt$/, 
                use: 'raw-loader' 
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: "./public/index.html"}),
    ]
}