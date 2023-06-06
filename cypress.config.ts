/* eslint @typescript-eslint/no-var-requires: "off" */
import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'a8nh14',
  video: false,
  e2e: {
    supportFile: false,
    baseUrl: 'http://localhost:3000',
  },
});
