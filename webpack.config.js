const path = require('path');
const webpack = require('webpack');

const production = process.env.PRODUCTION === 'true';

const rules = [{
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /(node_modules)/,
    loader: 'babel-loader',
    options: { presets: ["@babel/env"] }
},
{
    test: /\.css$/,
    use: ["style-loader", "css-loader"]
},
{
    test: /\.js$/,
    exclude: /(node_modules\/react-leaflet-heatmap-layer-v3)/,
    enforce: 'pre',
    use: ['source-map-loader'],
},
{
    test: /.(png|svg|jpe?g|gif|woff2?|ttf|eot)$/,
    use: ['file-loader']
}]


module.exports = {
    entry: './src/index.tsx',
    mode: production ? 'production' : 'development',
    devtool: production ? undefined : 'source-map',
    module: {
        rules: rules
    },
    resolve: { extensions: ['*', '.js', '.jsx', '.ts', '.tsx'] },
    output: {
        filename: 'bundle.js'
    },
    devServer: {
        port: 3000,
        hot: true
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
};