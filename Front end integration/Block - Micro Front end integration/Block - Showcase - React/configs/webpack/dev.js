// development config
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./common');
const config = require('../../src/config.json');

module.exports = merge(commonConfig, {
    mode: 'development',
    entry: [
        'react-hot-loader/patch', // activate HMR for React
        'webpack-dev-server/client?http://localhost:3100', // bundle the client for webpack-dev-server and connect to the provided endpoint
        'webpack/hot/only-dev-server', // bundle the client for hot reloading, only- means to only hot reload for successful updates
        './index.ts', // the entry point of our app (dont forger the extension)
    ],
    devServer: {
        hot: true, // enable HMR on the server
    },
    output: {
        publicPath: 'auto',
    },
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom',
        },
    },
    devtool: 'cheap-module-source-map',
    plugins: [
        new webpack.DefinePlugin({
            process: JSON.stringify({ env: config }),
        }),
    ],
});
