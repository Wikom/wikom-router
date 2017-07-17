/**
 * Created by rouven on 11.04.17.
 */

const path = require('path');
const webpack = require('webpack');

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
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                drop_console: true
            },
            output: {
                comments: false
            }
        })
    ],
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
