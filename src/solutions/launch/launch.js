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
    const uri = config('HIVE_URI');
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

export const handleNeoDashLaunch = async ({ queryString }) => {
  try {
    await auth.silentAuth();
  } catch (err) {
    if (err.message === 'login_required' || err.error === 'login_required') {
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
      let pasword;
      if (data.dbType == DatabaseUploadType.NeoConnection) {
        // Extract port, schema and hostname info from connection url
        const connectionComps = data.dbConnectionUrl.match(/(.+):\/\/([\w\.]+):?(\d+)?/);
        port = connectionComps[3] ? connectionComps[3] : '7687';
        hostName = connectionComps[2];
        schema = connectionComps[1];
        dbName = data.dbName ? data.dbName : 'neo4j';
        userName = data.dbUsername ? data.dbUsername : 'neo4j';
        pasword = data.dbPassword;
      } else if (data.dbType == DatabaseUploadType.DatabaseUpload) {
        port = '7687';
        hostName = 'localhost';
        schema = 'neo4j';
        dbName = data.dbName;
        userName = 'neo4j';
        pasword = '';
      }
      return {
        isHandled: true,
        config: {
          ssoEnabled: false,
          ssoDiscoveryUrl: 'https://example.com',
          standalone: true,
          standaloneProtocol: schema,
          standaloneHost: hostName,
          standalonePort: port,
          standaloneDatabase: dbName,
          standaloneDashboardName: data.title,
          standaloneDashboardDatabase: 'hive',
          standaloneDashboardURL: data.uuid,
          standaloneUsername: userName,
          standalonePassword: pasword,
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
