const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); //to access built-in plugins

const e = {
    output: {
        path: path.resolve(__dirname, "build"),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: [".jsx", ".js"]
    },
    module: {
        rules: [{ 
            test: /\.txt$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', "@babel/preset-react"]
                    ]
                }
            }
        }
    ]},
    plugins: [new HtmlWebpackPlugin({template: "public/index.html"})]
}

module.exports = e;