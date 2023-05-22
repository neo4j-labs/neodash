/* eslint @typescript-eslint/no-var-requires: "off" */
import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,
  e2e: {
    supportFile: false,
    baseUrl: 'http://localhost:3000',
  },
});
