const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); //to access built-in plugins
const dotenv = require('dotenv').config();

console.log('Node env: ', process.env.NODE_ENV)
console.log('Hosted port: ', process.env.PORT)
console.log('birdeye base uri: ', dotenv.parsed.BIRDEYE_BASE_URI)

const port = process.env.PORT || 3000
const environment = process.env.NODE_ENV || 'production'

// Reduce it to a nice object, the same as before (Optional)
module.exports = () =>{
    Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});
}

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
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.txt$/,
                use: 'raw-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: "./public/index.html"}),
    ],
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    }
}
