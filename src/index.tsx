import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from './store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import Application from './application/Application';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import './index.pcss';
import StyleConfig from './config/StyleConfig';
import * as Sentry from '@sentry/react';

if (window.location.href.includes('//neodash.graphapp.io/')) {
  Sentry.init({
    dsn: 'https://25edb17cc4c14c8cb726e7ac1ff74e3b@o110884.ingest.sentry.io/4505397810167808',
    allowUrls: [/^https:\/\/neodash\.graphapp\.io/, /^http:\/\/neodash\.graphapp\.io/],
    integrations: [
      new Sentry.BrowserTracing({
        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: [/^https:\/\/neodash\.graphapp\.io/, /^http:\/\/neodash\.graphapp\.io/],
      }),
      new Sentry.Replay({
        networkDetailAllowUrls: [/^https:\/\/neodash\.graphapp\.io/, /^http:\/\/neodash\.graphapp\.io/],
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}
/**
 * Set up the NeoDash application and wrap it in the needed providers.
 */
const store = configureStore();

// @ts-ignore - persist state in browser cache.
const persister = persistStore(store);

await StyleConfig.getInstance();

/** Wrap the application in a redux provider / browser cache persistance gate **/
const provider = (
  <ReduxProvider store={store}>
    <PersistGate persistor={persister} loading={<div>Loading NeoDash...</div>}>
      <Application />
    </PersistGate>
  </ReduxProvider>
);

ReactDOM.render(<React.StrictMode>{provider}</React.StrictMode>, document.getElementById('root'));
