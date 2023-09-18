/* eslint @typescript-eslint/no-var-requires: "off" */
import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'a8nh14',
  video: false,
  e2e: {
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 0,
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
  env: {
    codeCoverage: {
      exclude: ['cypress/**/*.*'],
    },
  },
});
