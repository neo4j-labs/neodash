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
import { datadogRum } from '@datadog/browser-rum';
import { ErrorBoundary, reactPlugin } from '@datadog/browser-rum-react';

datadogRum.init({
  applicationId: '70d24417-1080-494c-b15a-a18ea479da7c',
  clientToken: 'pub0b97bee959db42713ec1f74093f60876',
  // `site` refers to the Datadog site parameter of your organization
  // see https://docs.datadoghq.com/getting_started/site/
  site: 'datadoghq.com',
  service: 'oupt',
  env: 'dev',
  // Specify a version number to identify the deployed version of your application in Datadog
  version: '1.0.0',
  sessionSampleRate: 20,
  sessionReplaySampleRate: 20,
  defaultPrivacyLevel: 'mask-user-input',
  plugins: [reactPlugin()],
});

datadogRum.startSessionReplayRecording();

/**
 * Set up the NeoDash application and wrap it in the needed providers.
 */
export const store = configureStore();

// @ts-ignore - persist state in browser cache.
const persister = persistStore(store);

await StyleConfig.getInstance();

const ErrorFallback = ({ resetError, error }: { resetError: () => void; error: unknown }) => {
  return (
    <p>
      Oops, something went wrong! <strong>{String(error)}</strong> <button onClick={resetError}>Retry</button>
    </p>
  );
};

/** Wrap the application in a redux provider / browser cache persistance gate **/
const provider = (
  <ReduxProvider store={store}>
    <PersistGate persistor={persister} loading={<div>Loading NeoDash...</div>}>
      <ErrorBoundary fallback={ErrorFallback}>
        <Application />
      </ErrorBoundary>
    </PersistGate>
  </ReduxProvider>
);

ReactDOM.render(<React.StrictMode>{provider}</React.StrictMode>, document.getElementById('root'));
