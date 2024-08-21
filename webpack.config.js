const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

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
        host: process.env.HOST
    },
    mode: environment,
    resolve: {
        fallback: {
            os: require.resolve("os-browserify/browser"),
            path: require.resolve("path-browserify"),
            crypto: require.resolve("crypto-browserify"),
            https: require.resolve("https-browserify"),
            url: require.resolve("url"),
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
     /*   new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8888  // Use a different port for each instance
        })*/
    ],
    performance:
        {
            hints: false,
            maxEntrypointSize:
                312000,
            maxAssetSize:
                312000,
        }
}
