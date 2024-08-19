import auth0 from 'auth0-js';
import { saveQueryString } from '../launch/launchHelper';

export const AuthConstants = {
  auth0: 'auth0',
  silentAuth: 'silentAuth',
  callback: 'callback',
};

export const StorageConstants = {
  id_token: 'id_token',
  access_token: 'access_token',
  expires_at: 'expires_at',
  user: 'user',
};

export class Auth {
  constructor(properties) {
    let { domain, clientID, redirectUri, logoutUrl, authMethod, auth0Settings, galleryInfo, storageProvider } =
      properties;

    auth0Settings = auth0Settings || {};
    let webAuth = auth0Settings.webAuth || {};
    if (!webAuth.responseType) {
      webAuth.responseType = 'token id_token';
    }
    if (!webAuth.scope) {
      webAuth.scope = 'openid email profile';
    }
    if (webAuth.sso === undefined || webAuth.sso === null) {
      webAuth.sso = false;
    }

    this.auth0 = new auth0.WebAuth({
      domain: domain,
      clientID: clientID,
      redirectUri: redirectUri,
      ...webAuth,
    });

    this.email = null;
    this.storageProvider = storageProvider || localStorage;

    this.domain = domain;
    this.clientID = clientID;
    this.logoutUrl = logoutUrl;

    galleryInfo = galleryInfo || {};
    this.galleryGraphQLUrl = galleryInfo.galleryGraphQLUrl;
    this.galleryUiUrl = galleryInfo.galleryUiUrl;
    this.neoDashBaseUrl = galleryInfo.neoDashBaseUrl;
    this.verifyAccess = galleryInfo.verifyAccess === true || galleryInfo.verifyAccess === 'true';

    this.authMethod = authMethod;
    this.auth0AuthorizeParams = auth0Settings.authorize;
    if (!this.auth0AuthorizeParams) {
      this.auth0AuthorizeParams = {
        prompt: 'select_account',
        theme: { primaryColor: '#0085be' },
      };
    }
  }

  getEmail = () => {
    if (this.authMethod === AuthConstants.auth0) {
      return this.email;
    }
  };

  login = () => {
    saveQueryString(window.location.search);
    this.auth0.authorize(this.auth0AuthorizeParams);
  };

  isAuth0 = () => this.authMethod === AuthConstants.auth0;

  getIdToken = () => this.storageProvider.getItem(StorageConstants.id_token);

  fetchGraphQL = async ({ query, variables, uri, token, headers = {} }) => {
    return fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: token ? `Bearer ${token}` : '',
        ...headers,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }).then((res) => res.json());
  };

  handleAuthentication = () => {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) {
          return reject(new Error(err.error));
        }
        if (!authResult?.idToken) {
          return reject(new Error('auth_token_missing'));
        }
        this.setSession(authResult);
        resolve();
      });
    });
  };

  setSession = (authResult) => {
    // Set the time that the access token will expire at
    this.idToken = authResult.idToken;
    this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime();

    // Set the time that the access token will expire at, in this case 1 hour
    this.storageProvider.setItem(StorageConstants.access_token, authResult.accessToken);
    this.storageProvider.setItem(StorageConstants.id_token, authResult.idToken);
    this.idTokenPayload = authResult.idTokenPayload;
    this.storageProvider.setItem(StorageConstants.expires_at, this.expiresAt);
    this.email = authResult.idTokenPayload ? authResult.idTokenPayload.email : null;
    this.email = this.email !== undefined ? this.email : null;
  };

  silentAuth = async () => {
    let promise = new Promise((resolve, reject) => {
      if (this.isAuth0()) {
        this.auth0.checkSession({}, async (err, authResult) => {
          if (err) {
            return reject(new Error(err.error));
          }
          if (!authResult?.idToken) {
            return reject(new Error('auth_token_missing'));
          }
          this.setSession(authResult);

          if (this.verifyAccess) {
            const result = await this.verifyDemoAccess({ caller: AuthConstants.silentAuth });
            if (!result.hasAccess) {
              this.removeLocalStorageItems();
              window.location.replace(this.galleryUiUrl);
            }
            resolve(result.hasAccess);
          } else {
            resolve(true);
          }
        });
      } else {
        resolve(true);
      }
    });
    return await promise; // eslint-disable-line
  };

  logout = () => {
    console.log(this.domain);

    this.removeLocalStorageItems();

    const authDomain = this.domain || 'domain not specified';
    const logoutUrl = this.logoutUrl || 'logoutUrl not specified';
    const clientId = this.clientID || 'clientID not specified';

    window.location.replace(`https://${authDomain}/v2/logout/?returnTo=${logoutUrl}&client_id=${clientId}`);
  };

  isAuthenticated = () => {
    if (this.isAuth0()) {
      let expiresAt = JSON.parse(this.storageProvider.getItem(StorageConstants.expires_at));
      return parseInt(new Date().getTime()) < parseInt(expiresAt);
    }
    return true;
  };

  verifyDemoAccess = async ({ caller }) => {
    if (this.isAuth0() && !this.getIdToken()) {
      return false;
    }

    const uri = this.galleryGraphQLUrl;

    const query = `
            mutation verifyUserHasAccessToSolution ($baseUrl: String!) {
                result: verifyUserHasAccessToSolution(baseUrl: $baseUrl) {
                    hasAccess
                    userPrimaryOrganization
                    solutionId
                    solutionName
                    solutionType
                    matchingDeploymentId
                    matchingDeploymentUrl
                    matchingDeploymentName
                }
            }
        `;
    const variables = {
      baseUrl: this.neoDashBaseUrl,
    };
    const token = this.getIdToken();

    let promise = new Promise((resolve, _) => {
      this.fetchGraphQL({ uri, query, variables, token })
        .then((result) => {
          const { data, errors } = result;
          if (errors) {
            console.log(`${caller} verifyDemoAccess access check error (1)`);
            console.log(errors);
            alert(
              `${caller} verifyDemoAccess access check error (1): ${JSON.stringify(
                errors
              )}, returning to NeoDash Gallery.`
            );
            resolve({ hasAccess: false });
          } else {
            if (data.result && data.result.hasAccess === false) {
              alert('You have not been granted access to this demo, returning to NeoDash Gallery.');
            }
            resolve(data.result);
          }
        })
        .catch((error) => {
          console.log(`${caller} verifyDemoAccess access check error (2)`);
          console.log(error);
          alert(
            `${caller} verifyDemoAccess access check error (2): ${JSON.stringify(error)}, returning to NeoDash Gallery.`
          );
          resolve({ hasAccess: false });
        });
    });
    return await promise; // eslint-disable-line
  };

  removeLocalStorageItems() {
    this.storageProvider.removeItem(StorageConstants.user);
    this.storageProvider.removeItem(StorageConstants.access_token);
    this.storageProvider.removeItem(StorageConstants.id_token);
    this.storageProvider.removeItem(StorageConstants.expires_at);
  }
}
