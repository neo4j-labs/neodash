import { getAuth } from '../auth/auth';
import { config } from '../config/dynamicConfig';
import { handleErrors } from '../util/util';
import { handleSavedQueryString, saveQueryString } from './launchHelper';

export const fetchDashboardFromHive = async ({ uuid }) => {
  let auth = await getAuth();
  const promise = new Promise((resolve, reject) => {
    const query = `
            query GetDashboardByUUID ($uuid: ID!) {
                getDashboardByUUID (uuid: $uuid) {
                    uuid
                    date
                    title
                    content
                    version
                    user
                    dbName
                    dbType
                    dbConnectionUrl
                    dbUsername
                    dbPassword
                }
            } 
        `;
    const uri = config('GalleryGraphQLUrl');
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: auth.getIdToken() ? `Bearer ${auth.getIdToken()}` : '',
      },
      body: JSON.stringify({
        query: query,
        variables: { uuid: uuid },
      }),
    })
      .then(handleErrors)
      .then(async (res) => {
        const jsonResponse = await res.json();
        resolve(jsonResponse);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
};

export const hiveAuthenticate = async ({ queryString }) => {
  let auth = await getAuth();
  try {
    let response = await auth.silentAuth();
    return { isAuthenticated: response };
  } catch (err) {
    if (err.message === 'login_required' || err.error === 'login_required') {
      saveQueryString(queryString);
      auth.login();
      return { isAuthenticated: false };
    }
    alert('An unknown error occurred, check the console for details.');
    return { isHandled: false };
  }
};

export const handleNeoDashLaunch = async ({ queryString }) => {
  let auth = await getAuth();
  queryString = handleSavedQueryString(queryString);

  const urlParams = new URLSearchParams(queryString);
  const dashboardUuid = urlParams.get('hivedashboarduuid');
  if (dashboardUuid) {
    try {
      const response = await fetchDashboardFromHive({ uuid: dashboardUuid });
      const data = response?.data?.getDashboardByUUID;

      // Extract port, schema and hostname info from connection url
      const connectionComps = data.dbConnectionUrl.match(/(.+):\/\/([\w.-]+):?(\d+)?/);
      const port = connectionComps[3] ? connectionComps[3] : '7687';
      const hostName = connectionComps[2];
      const schema = connectionComps[1];
      const dbName = data.dbName ? data.dbName : 'neo4j';
      const userName = data.dbUsername ? data.dbUsername : 'neo4j';
      const password = data.dbPassword;

      return {
        isHandled: true,
        config: {
          ssoEnabled: false,
          ssoDiscoveryUrl: 'https://example.com',
          standalone: data.user != auth.getEmail(), // eslint-disable-line
          standaloneProtocol: schema,
          standaloneHost: hostName,
          standalonePort: port,
          standaloneDatabase: dbName,
          standaloneDashboardName: data.title,
          standaloneDashboardDatabase: 'hive',
          standaloneDashboardURL: data.uuid,
          standaloneUsername: userName,
          standalonePassword: password,
          standalonePasswordWarningHidden: true,
          isOwner: data.user == auth.getEmail(), // eslint-disable-line
        },
      };
    } catch (e) {
      console.log('error calling fetchDashboardFromHive: ', e);
    }
  }
  return { isHandled: false };
};
