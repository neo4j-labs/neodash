import auth from '../auth/auth';
import { config } from '../config/dynamicConfig';
import { handleErrors } from '../util/util';

const fetchDashboardFromHive = async ({ uuid }) => {
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
      return {
        isHandled: true,
        config: {
          ssoEnabled: false,
          ssoDiscoveryUrl: 'https://example.com',
          standalone: true,
          standaloneProtocol: 'neo4j',
          standaloneHost: 'localhost',
          standalonePort: '7687',
          standaloneDatabase: data.dbName,
          standaloneDashboardName: data.title,
          standaloneDashboardDatabase: 'hive',
          standaloneDashboardURL: data.uuid,
        },
      };
    } catch (e) {
      // TODO: display error?
      console.log('error calling fetchDashboardFromHive: ', e);
      return { isHandled: false };
    }
  }
};
