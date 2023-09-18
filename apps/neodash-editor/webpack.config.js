const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const basePath = process.cwd();

const circularPlugin = new CircularDependencyPlugin({
  // exclude detection of files based on a RegExp
  exclude: /a\.js|node_modules/,
  // add errors to webpack instead of warnings
  failOnError: false,
  // allow import cycles that include an asyncronous import,
  // e.g. via import(/* webpackMode: "weak" */ './file.js')
  allowAsyncCycles: false,
  // set the current working directory for displaying module paths
  cwd: process.cwd(),
});

const circularValidation = false;

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
    devtool: !production ? 'eval-source-map' : 'source-map',
    module: {
      rules: rules,
    },
    resolve: {
      alias: {},
      modules: [
        path.resolve(basePath, "node_modules"),
        path.resolve(basePath, "../../node_modules")
      ],
      extensions: [".js", ".jsx", ".ts", ".tsx", "*"],
      mainFields: ["browser", "module", "main"]
    },
    output: {
      filename: 'bundle.js',
    },
    devServer: {
      port: 3000,
      hot: true,
    },
    plugins: production
      ? [
          sentryWebpackPlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: 'neo4j-inc',
            project: 'neodash',
          }),
        ]
      : [new ReactRefreshWebpackPlugin(), ...(circularValidation ? [circularPlugin] : [])],
    ignoreWarnings: [/Failed to parse source map/],
  };
};
