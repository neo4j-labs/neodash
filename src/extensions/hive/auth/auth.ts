/* eslint require-atomic-updates: 0 */
import { Auth } from './authLib';
import { config, loadConfig } from '../config/dynamicConfig';

let auth = null;

export const getAuth = async () => {
  if (!auth) {
    await loadConfig();
    auth = new Auth({
      domain: config('AuthDomain'),
      logoutUrl: config('AuthLogoutUrl'),
      clientID: config('AuthClientID'),
      redirectUri: config('AuthCallback'),
      authMethod: config('AuthMethod'),
      galleryInfo: {
        // the graphql api of the gallery, e.g. https://your.domain.com/neodashgallery/graphql
        galleryGraphQLUrl: config('GalleryGraphQLUrl'),
        // the graphql ui of the gallery, e.g. https://your.domain.com/neodashgallery
        galleryUiUrl: config('GalleryUIUrl'),
        // the base uri that you use to launch the neodash ui, e.g. https://your.domain.com/neodash
        neoDashBaseUrl: config('NeoDashBaseDemoUrl'),
        // set this to true to call the graphql endpoing verifyDemoAccess to confirm the user is
        //  authorized to run the demo
        verifyAccess: config('VerifyAccess'),
      },
    });
  }
  return auth;
};
