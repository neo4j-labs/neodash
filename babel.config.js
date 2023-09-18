const es = !!process.env.ES;

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        // useBuiltIns: false,
        modules: es ? false : "commonjs",
        targets: {
          browsers: [
            // 'last 2 versions',
            // 'not ie > 0',
            "chrome > 60"
          ]
        }
        // "targets": "> 0.25%, not dead"
        // "targets": "last 2 versions, > 5%"
      }
    ],
    "@babel/preset-typescript",
    "@babel/preset-react"
  ],
  plugins: [
    
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-transform-runtime",
    "istanbul"
  ]
};