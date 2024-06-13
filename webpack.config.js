const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv').config();
const Dotenv = require('dotenv-webpack');

console.log('Node env: ', process.env.NODE_ENV)
console.log('Hosted port: ', process.env.PORT)
console.log('birdeye base uri: ', dotenv.parsed.BIRDEYE_BASE_URI)

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
            crypto: require.resolve("crypto-browserify"),
            https: require.resolve("https-browserify"),
            url: require.resolve("url/"),
            assert: require.resolve("assert"),
            http: require.resolve("stream-http"),
            stream: require.resolve("stream-browserify")
        },
        extensions: [".jsx", ".js"]
    },
    module: {
        rules: [{
            test: /\.(gif|png|jpe?g|svg)$/i,
            loader: 'file-loader',
            options: {
                bypassOnDebug: true, // webpack@1.x
                disable: true, // webpack@2.x and newer
            }
        },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.(docx|pdf)$/i,
                use:
                    ["style-loader", "css-loader"],
            }
            ,
            {
                test: /\.css$/i,
                use:
                    ["style-loader", "css-loader"],
            }
            ,
            {
                test: /\.txt$/,
                use:
                    'raw-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: "./public/index.html"}),
        new Dotenv()
    ],
    performance:
        {
            hints: false,
            maxEntrypointSize:
                512000,
            maxAssetSize:
                512000,
        }
}
