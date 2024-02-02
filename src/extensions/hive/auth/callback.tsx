/*
 * Copyright (c) 2017-present “Neo4j, Inc.” [http://neotechnology.com]
 *
 * This file is part of Neo4j Solutions Accelerators.
 * Neo4j accelerator frameworks and use case based starter kits are Neo4j IP: you cannot redistribute it
 * and they fall under the terms of the Neo4j Partner Agreement as negotiated by
 * Neo4j, Inc. and its Partners.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * You are requested to contribute any modifications back to the Neo4j Solutions Team at solutions@neo4j.com
 *
 * For questions reach our to Neo4j Solutions Team - solutions@neo4j.com
 * https://github.com/Neo4jSolutions
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import auth from './auth';
import { getDynamicConfigValue } from '../config/dynamicConfig';
import { handleSavedQueryString } from '../launch/launchHelper';

class Callback extends Component {
  async componentDidMount() {
    await auth.handleAuthentication({ caller: 'callback' });
    let queryString = handleSavedQueryString();
    let baseUri = getDynamicConfigValue('REACT_APP_NEODASH_BASE_DEMO_URL');
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
