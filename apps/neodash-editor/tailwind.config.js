module.exports = {
  content: ['../../packages/neodash-engine/src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('@neo4j-ndl/base').tailwindConfig],
  corePlugins: {
    preflight: false,
  },
};
