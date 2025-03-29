const { ModuleFederationPlugin } = require('webpack').container;
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const path = require('path');

const circularPlugin = new CircularDependencyPlugin({
  exclude: /a\.js|node_modules/,
  failOnError: false,
  allowAsyncCycles: false,
  cwd: process.cwd(),
});

const circularValidation = false;

const rules = [
  {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /(node_modules)/,
    loader: 'babel-loader',
    options: {
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

module.exports = (env) => {
  const production = env.production;

  return {
    experiments: {
      topLevelAwait: true,
    },
    entry: './src/index.tsx',
    mode: production ? 'production' : 'development',
    devtool: production ? 'source-map' : 'eval-cheap-module-source-map',
    module: { rules },
    resolve: { extensions: ['*', '.js', '.jsx', '.ts', '.tsx'] },
    output: {
      publicPath: 'auto',
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    devServer: {
      port: 3000,
      host: '0.0.0.0', // Allow remote access
      allowedHosts: 'all',
      hot: true,
      compress: true,
      client: {
        overlay: { warnings: false },
      },
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'neodash',
        filename: 'remoteEntry.js',
        exposes: {
          './Dashboard': './src/application/Application', // Modify as needed
        },
        shared: {
          react: { singleton: true, eager: true, requiredVersion: '^17.0.2' },
          'react-dom': { singleton: true, eager: true, requiredVersion: '^17.0.2' },
        },
      }),
      ...(production
        ? [
            sentryWebpackPlugin({
              authToken: process.env.SENTRY_AUTH_TOKEN,
              org: 'neo4j-inc',
              project: 'neodash',
            }),
          ]
        : [new ReactRefreshWebpackPlugin(), ...(circularValidation ? [circularPlugin] : [])]),
    ],
    ignoreWarnings: [/Failed to parse source map/],
  };
};
