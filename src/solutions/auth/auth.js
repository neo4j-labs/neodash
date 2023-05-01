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

import { Auth } from './authLib';
import { config } from '../config/dynamicConfig';

const auth = new Auth({
  domain: config('AUTH_DOMAIN'),
  logoutUrl: config('AUTH_LOGOUT_URL'),
  clientID: config('AUTH_CLIENT_ID'),
  redirectUri: config('AUTH_CALLBACK'),
  authMethod: config('AUTH_METHOD'),
  galleryInfo: {
    // the graphql api of the gallery, e.g. https://your.domain.com/neodashgallery/graphql
    galleryGraphQLUrl: config('GALLERY_GRAPHQL_URL'),
    // the graphql ui of the gallery, e.g. https://your.domain.com/neodashgallery
    galleryUiUrl: config('GALLERY_UI_URL'),
    // the base uri that you use to launch the neodash ui, e.g. https://your.domain.com/neodash
    neoDashBaseUrl: config('NEODASH_BASE_DEMO_URL'),
    // set this to true to call the graphql endpoing verifyDemoAccess to confirm the user is
    //  authorized to run the demo
    verifyAccess: config('VERIFY_ACCESS'),
  },
});
export default auth;
