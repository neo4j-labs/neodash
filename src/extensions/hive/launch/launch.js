import auth from '../auth/auth';
import { config } from '../config/dynamicConfig';
import { DatabaseUploadType } from '../config/SolutionsConstants';
import { handleErrors } from '../util/util';

export const fetchDashboardFromHive = async ({ uuid }) => {
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
    const uri = config('GALLERY_GRAPHQL_URL');
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

const QueryStorageKey = 'neoDashPreAuthQueryString';

// https://stackoverflow.com/questions/8648892/how-to-convert-url-parameters-to-a-javascript-object
const getUrlQueryParamObject = (queryString) => {
  const urlParams = new URLSearchParams(queryString);
  const entries = urlParams.entries(); //returns an iterator of decoded [key,value] tuples
  const result = {};
  for (const [key, value] of entries) {
    // each 'entry' is a [key, value] tupple
    result[key] = value;
  }
  return result;
};

export const handleNeoDashLaunch = async ({ queryString }) => {
  try {
    //console.log('handleNeoDashLaunch before silentAuth')
    await auth.silentAuth();
    //console.log('handleNeoDashLaunch after silentAuth')
    if (!queryString) {
      //console.log('handleNeoDashLaunch localStorage - getting query string')
      queryString = localStorage.getItem(QueryStorageKey) || '';
      if (queryString) {
        //console.log('handleNeoDashLaunch query string from local storage is', queryString)
        const queryObject = getUrlQueryParamObject(queryString);
        window.history.pushState(queryObject, document.title, new URL(queryString, window.location.href));
      }
    }
    localStorage.removeItem(QueryStorageKey);
  } catch (err) {
    //console.log('handleNeoDashLaunch err')
    if (err.message === 'login_required' || err.error === 'login_required') {
      //console.log('handleNeoDashLaunch login_required')
      if (queryString) {
        //console.log('handleNeoDashLaunch localStorage - storing query string')
        localStorage.setItem(QueryStorageKey, queryString);
      }
      auth.login();
    } else {
      alert('An unknown error occurred, check the console for details.');
      return { isHandled: false };
    }
  }

  const urlParams = new URLSearchParams(queryString);
  const dashboardUuid = urlParams.get('hivedashboarduuid');
  if (!dashboardUuid) {
    return { isHandled: false };
  } else {
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
      const connectionComps = data.dbConnectionUrl.match(/(.+):\/\/([\w\.\-]+):?(\d+)?/);
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
          standalone: data.user == auth.getEmail() ? false : true,
          standaloneProtocol: schema,
          standaloneHost: hostName,
          standalonePort: port,
          standaloneDatabase: dbName,
          standaloneDashboardName: data.title,
          standaloneDashboardDatabase: 'hive',
          standaloneDashboardURL: data.uuid,
          standaloneUsername: userName,
          standalonePassword: password,
          isOwner: data.user == auth.getEmail() ? true : false,
        },
      };
    } catch (e) {
      // TODO: display error?
      console.log('error calling fetchDashboardFromHive: ', e);
      return { isHandled: false };
    }
  }
};
