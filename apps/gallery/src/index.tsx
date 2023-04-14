import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom';
// We need to include the base CSS in the root of
// the app so all of our components can inherit the styles
import '@neo4j-ndl/base/lib/neo4j-ds-styles.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
