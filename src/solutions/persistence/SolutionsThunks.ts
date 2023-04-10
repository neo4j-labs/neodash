import { createUUID } from '../../dashboard/DashboardThunks';
import { createNotificationThunk } from '../../page/PageThunks';
import { config } from '../config/dynamicConfig';
import auth from '../auth/auth';
import { handleErrors } from '../util/util';
import { updateHiveInformation } from './HiveActions';
import { DatabaseUploadType } from '../config/SolutionsConstants';

const MergeSolutionAndDashboard = `
  mutation MergeSolutionAndDashboard ($cardInput: SolutionInput!, $deploymentInput: DeploymentInput!, $neoDashInput: UploadDashboardInput!, $caller: String!) {
    mergeSolutionAndDashboard(cardInput: $cardInput, deploymentInput: $deploymentInput, neoDashInput: $neoDashInput, caller: $caller) {
      id
      name
    }
  }
`;

const listUserDashboardsQuery = `query ListUserDashboards($user: String) {
  dashboards:listUserDashboards(user:$user) {
    uuid
    user
    dbName
    fileName
    dbType
  }
}`;

export const listUserDashboards = async () => {
  const promise = new Promise((resolve, reject) => {
    const variables = {
      user: auth.getEmail(),
    };

    const uri = config('HIVE_URI');
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: auth.getIdToken() ? `Bearer ${auth.getIdToken()}` : '',
      },
      body: JSON.stringify({
        query: listUserDashboardsQuery,
        variables,
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

const saveDashboardToHiveGraphQL = async ({
  dispatch,
  dashboard,
  dbName,
  dbType,
  dbConnectionUrl,
  dbUsername,
  dbPassword,
  fileName,
  domain,
  image,
}) => {
  const promise = new Promise((resolve, reject) => {
    let dashboardCopy = JSON.parse(JSON.stringify(dashboard));
    dashboardCopy.extensions = dashboardCopy.extensions || {};
    dashboardCopy.extensions.solutionsHive = dashboardCopy.extensions.solutionsHive || {};
    dashboardCopy.extensions.solutionsHive = {
      uuid: dashboardCopy.extensions.solutionsHive.uuid || createUUID(),
      dbName: dbName,
    };

    const { uuid } = dashboardCopy.extensions.solutionsHive;
    const { title } = dashboardCopy;

    dispatch(updateHiveInformation('uuid', uuid));
    dispatch(updateHiveInformation('dbName', dbName));

    const baseNeoDashUrl = config('NEODASH_BASE_DEMO_URL');
    const url = `${baseNeoDashUrl}/?hivedashboarduuid=${uuid}`;

    const variables = {
      caller: 'NEODASH',
      cardInput: {
        solutionId: uuid,
        name: title,
        type: 'neodash',
        // type: 'demo',
        // domain: 'public',
        domain: domain,
        image: image,
        github: '',
      },
      deploymentInput: {
        name: 'NeoDash Demo',
        url: url,
      },
      neoDashInput: {
        uuid: uuid,
        title: title,
        content: JSON.stringify(dashboardCopy),
        dbName: dbName,
        version: dashboardCopy.version,
        user: auth.getEmail(),
        dbType: dbType,
        dbConnectionUrl: dbConnectionUrl,
        dbUsername: dbUsername,
        dbPassword: dbPassword,
        fileName: fileName,
      },
    };

    const uri = config('HIVE_URI');
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: auth.getIdToken() ? `Bearer ${auth.getIdToken()}` : '',
      },
      body: JSON.stringify({
        query: MergeSolutionAndDashboard,
        variables,
      }),
    })
      .then(handleErrors)
      .then(async (res) => {
        const jsonResponse = await res.json();
        resolve({
          response: jsonResponse,
          variables: variables,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
};

export const saveDashboardToHiveThunk =
  ({
    dashboard,
    overwrite = false,
    progressCallback,
    dbType,
    dbConnectionUrl,
    dbUsername,
    dbPassword,
    dbName,
    domain,
    image,
  }) =>
  async (dispatch: any) => {
    const saveHiveCardArgs = {
      dispatch,
      dashboard,
      overwrite,
      dbType,
      dbConnectionUrl,
      dbUsername,
      dbPassword,
      dbName,
      domain,
      image,
    };
    try {
      const hiveinfo = await saveDashboardToHiveGraphQL({
        ...saveHiveCardArgs,
        fileName: '',
      });
      const savedId = hiveinfo?.response?.data?.mergeSolutionAndDashboard?.id;
      progressCallback({
        solutionId: savedId,
      });
      // dispatch(createNotificationThunk('🎉 Success!', 'Your current dashboard was saved to Hive.'));
    } catch (e) {
      dispatch(createNotificationThunk('Unable to save dashboard to Hive (errno: 2)', e));
    }
  };
