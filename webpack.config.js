const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');

const rules = [
  {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /(node_modules)/,
    loader: 'babel-loader',
    options: {
      presets: ['@babel/env'],
      //plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
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

// TODO - move this config to a dedicated environment file.
// TODO - use process.env.NODE_ENV which will directly return the environment string "development", "production".
module.exports = (env) => {
  const production = env.production;
  return {
    experiments: {
      topLevelAwait: true,
    },
    entry: ['./src/index.tsx'],
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
      port: 3000,
      hot: true,
      // https://stackoverflow.com/questions/31945763/how-to-tell-webpack-dev-server-to-serve-index-html-for-any-route
      historyApiFallback: {
        index: 'index.html',
      },
    },
    plugins: production
      ? [
          new webpack.DefinePlugin({
            process: { env: {} },
          }),
        ]
      : [
          new webpack.HotModuleReplacementPlugin(),
          // https://stackoverflow.com/questions/70368760/react-uncaught-referenceerror-process-is-not-defined
          new webpack.DefinePlugin({
            process: { env: {} },
          }),
          new ReactRefreshWebpackPlugin(),
        ],
    ignoreWarnings: [/Failed to parse source map/],
  };
};
