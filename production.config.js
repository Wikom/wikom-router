/**
 * Created by rouven on 11.04.17.
 */

const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'wikomRouter',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    devtool: 'source-map',
    externals: {
        "find-in-object": "find-in-object",
        "path-to-regexp": "path-to-regexp",
        "prop-types": "prop-types",
        "react": "react",
        "react-dom": "react-dom",
        "react-redux": "react-redux",
        "react-router": "react-router",
        "react-router-redux": "react-router-redux",
        "redux": "redux"
    }
};
