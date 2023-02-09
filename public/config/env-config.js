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

/*
    // prod
    REACT_APP_AUTH_DOMAIN: "neo4j-sync.auth0.com",
    REACT_APP_AUTH_CLIENT_ID: "WI1g67RXNvycmOh9rjTNwfRcKRx0FxhL",

    // dev
    REACT_APP_AUTH_DOMAIN: "dev-o8s8b52y.auth0.com",
    REACT_APP_AUTH_CLIENT_ID: "3OOrQh3TYyNOT8Y0AeE2tWek3wX0PAef",
*/

window._dynamicEnv_ = {
  REACT_APP_HIVE_URI: 'http://localhost:4001/graphql',
  REACT_APP_HIVE_UI: 'http://localhost:3002/solutions',
  REACT_APP_SOLUTION: 'neodash',
  REACT_APP_AUTH_DOMAIN: 'dev-o8s8b52y.auth0.com',
  REACT_APP_AUTH_CLIENT_ID: '3OOrQh3TYyNOT8Y0AeE2tWek3wX0PAef',
  REACT_APP_AUTH_METHOD: 'auth0',
  REACT_APP_SOLUTION_BASE_URL_IN_HIVE: 'http://localhost:3000',
  REACT_APP_NEODASH_BASE_DEMO_URL: 'http://localhost:3000',
  REACT_APP_AUTH_CALLBACK: 'http://localhost:3000/callback',
  REACT_APP_AUTH_LOGOUT_URL: 'http%3A%2F%2Flocalhost:3000',
  REACT_APP_FILE_UPLOAD_URL: 'http://localhost:4002/upload',
};
