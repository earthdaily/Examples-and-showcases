// shared config (dev and prod)
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        plugins: [new TsconfigPathsPlugin()],
    },
    context: resolve(__dirname, '../../src'),
    module: {
        rules: [
            {
                test: /\.md$/,
                loader: 'raw-loader',
            },
            {
                test: [/\.jsx?$/, /\.tsx?$/],
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-react', '@babel/preset-typescript'],
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(scss|sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?hash=sha512&digest=hex&name=img/[contenthash].[ext]',
                    'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false',
                ],
            },
        ],
    },
    plugins: [
        new NodePolyfillPlugin({
            excludeAliases: ['console', 'process'],
        }),
        new HtmlWebpackPlugin({
            template: 'index.html.ejs',
            favicon: '../public/favicon.svg', // relative path is from src
        }),
    ],
    performance: {
        hints: false,
    },
};
