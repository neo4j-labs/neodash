import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { getAuth } from './auth';

class PrivateRoute extends Component {
  state = {
    authInitialized: false,
  };

  async componentDidMount() {
    this.auth = await getAuth();
    this.setState({ authInitialized: true });
  }

  render() {
    let { authInitialized } = this.state;
    let { path, component, ...rest } = this.props;

    if (authInitialized) {
      return (
        <Route
          exact
          path={path}
          render={(props) => {
            if (!this.auth.isAuthenticated()) {
              setTimeout(() => {
                this.auth.login();
              }, 1000);
              return (
                <p style={{ padding: '20px', color: 'white' }}>
                  You are not currently authenticated. Redirecting to login.
                </p>
              );
            }
            // return <Component {...props} {...rest} />;
            return React.createElement(component, { ...props });
          }}
        />
      );
    }
    return <span>One moment please...</span>;
  }
}

export default PrivateRoute;
