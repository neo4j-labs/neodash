import { getAuth } from '../auth/auth';
import { config } from '../config/dynamicConfig';
import { DatabaseUploadType } from '../config/SolutionsConstants';
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
    // console.log('handleNeoDashLaunch before silentAuth')
    let response = await auth.silentAuth();
    return { isAuthenticated: response };
    // queryString = handleSavedQueryString(queryString);
  } catch (err) {
    // console.log('handleNeoDashLaunch err: ', err)
    if (err.message === 'login_required' || err.error === 'login_required') {
      // console.log('handleNeoDashLaunch login_required')
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

      let port = '7687';
      let hostName;
      let schema = 'neo4j';
      let dbName = 'neo4j';
      let userName = 'neo4j';
      let password;

      // Extract port, schema and hostname info from connection url
      const connectionComps = data.dbConnectionUrl.match(/(.+):\/\/([\w.-]+):?(\d+)?/);
      port = connectionComps[3] ? connectionComps[3] : '7687';
      hostName = connectionComps[2];
      schema = connectionComps[1];
      dbName = data.dbName ? data.dbName : 'neo4j';
      userName = data.dbUsername ? data.dbUsername : 'neo4j';
      password = data.dbPassword;

      return {
        isHandled: true,
        config: {
          ssoEnabled: false,
          ssoDiscoveryUrl: 'https://example.com',
          standalone: data.user == auth.getEmail() ? false : true, // eslint-disable-line
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
          isOwner: data.user == auth.getEmail() ? true : false, // eslint-disable-line
        },
      };
    } catch (e) {
      // TODO: display error?
      console.log('error calling fetchDashboardFromHive: ', e);
    }
  }
  return { isHandled: false };
};
