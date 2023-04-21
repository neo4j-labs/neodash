const HtmlWebpackPlugin = require('html-webpack-plugin');
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
    test: /\.css$/i,
    // include: path.resolve(__dirname, 'src'),
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

const plugins = [
  new webpack.DefinePlugin({ PUBLIC_URL: JSON.stringify('/') }),
  new HtmlWebpackPlugin({
    template: 'public/index.html',
    path: 'dist',
    filename: 'index.html',
    // favicon: 'src/favicon.ico'
  }),
];

// TODO - move this config to a dedicated environment file.
// TODO - use process.env.NODE_ENV which will directly return the environment string "development", "production".
module.exports = (env) => {
  const production = env.production;
  return {
    entry: './src/index.tsx',
    mode: production ? 'production' : 'development',
    devtool: production ? undefined : 'source-map',
    module: {
      rules: rules,
    },
    resolve: { extensions: ['*', '.js', '.jsx', '.ts', '.tsx'] },
    output: {
      filename: 'bundle.js',
    },
    devServer: {
      port: 4000,
      hot: true,
    },
    plugins: production ? plugins : [new webpack.HotModuleReplacementPlugin(), ...plugins],
    ignoreWarnings: [/Failed to parse source map/],
  };
};
