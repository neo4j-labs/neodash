import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from './store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import Application from './application/Application';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

// new imports
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Callback from './solutions/auth/callback';
import PrivateRoute from './solutions/auth/privateRoute';

/**
 * Set up the NeoDash application and wrap it in the needed providers.
 */
const store = configureStore();

// @ts-ignore - persist state in browser cache.
const persister = persistStore(store);

/** Wrap the application in a redux provider / browser cache persistance gate **/
const provider = (
  <ReduxProvider store={store}>
    <PersistGate persistor={persister} loading={<div>Loading NeoDash...</div>}>
      <Router>
        <Route exact path='/callback' component={Callback} />
        <PrivateRoute exact path='/' component={Application} />
      </Router>
    </PersistGate>
  </ReduxProvider>
);

ReactDOM.render(<React.StrictMode>{provider}</React.StrictMode>, document.getElementById('root'));
