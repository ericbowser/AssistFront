const path = require('path');

const e = {
    output: {
        filename: 'build/bundle.js',
    },
    module: {
        rules: [{ 
            test: /\.txt$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {targets: "defaults"}]
                    ]
                }
            }
        }
    ]}
}

module.exports = e;