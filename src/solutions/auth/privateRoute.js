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

import React from 'react';
import { Route } from 'react-router-dom';
import auth from './auth';

const PrivateRoute = ({ path, component: Component, ...rest }) => (
  <Route
    exact
    path={path}
    render={(props) => {
      if (!auth.isAuthenticated()) {
        setTimeout(() => {
          auth.login();
        }, 1000);
        return (
          <p style={{ padding: '20px', color: 'white' }}>You are not currently authenticated. Redirecting to login.</p>
        );
      }
      return <Component {...props} {...rest} />;
    }}
  />
);

export default PrivateRoute;
