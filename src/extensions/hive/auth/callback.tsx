import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { getAuth } from './auth';
import { configAsync } from '../config/dynamicConfig';
import { handleSavedQueryString } from '../launch/launchHelper';

class Callback extends Component {
  async componentDidMount() {
    let auth = await getAuth();
    await auth.handleAuthentication({ caller: 'callback' });
    let queryString = handleSavedQueryString();
    let baseUri = await configAsync('NeoDashBaseDemoUrl');
    let redirectUri = queryString ? `${baseUri}${queryString}` : baseUri;
    window.location.replace(redirectUri);
  }

  render() {
    const style = {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
    };
    return <div style={style} />;
  }
}
export default withRouter(Callback);
