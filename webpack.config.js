const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const dotenv = require('dotenv').config();

console.log('Node env: ', dotenv.parsed.NODE_ENV)
console.log('Hosted port: ', dotenv.parsed.PORT)

const port = dotenv.parsed.PORT || 3000
const environment = dotenv.parsed.NODE_ENV || 'production'

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
        host: process.env.HOST,
        hot: true,
    },
    mode: environment,
    resolve: {
        fallback: {
            buffer: require.resolve("buffer/"),
            vm: require.resolve("vm/"),
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
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
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
            },
            {
                test: /\.svg$/,
                use:  ['@svgr/webpack'],
                issuer: {
                    and: [ '/\\.(js|ts|jsx|tsx)x?$/' ]
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: "./public/index.html"}),
        new Dotenv(path.resolve(__dirname, ".env")),
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
