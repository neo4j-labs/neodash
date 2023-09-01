const path = require('path');
const webpack = require('webpack');


const rules = [
    {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
            rootMode: 'upward',
            presets: ['@babel/env'],
        },
    },
    {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
    },
    {
        test: /\.pcss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
    },
    {
        test: /\.js$/,
        exclude: /(node_modules\/react-leaflet-heatmap-layer-v3)/,
        enforce: 'pre',
        use: ['source-map-loader'],
    },
    {
        test: /.(png|svg|jpe?g|gif|woff2?|ttf|eot)$/,
        use: ['file-loader'],
    },
];


module.exports = {
    entry: {
        '@neodash/engine': path.resolve(__dirname, 'src/index.tsx')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: '@neodash/engine',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    plugins: [],
    module: {
        rules: rules,
    }
}