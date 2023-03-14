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
}) => {
  const promise = new Promise((resolve, reject) => {
    let dashboardCopy = JSON.parse(JSON.stringify(dashboard));
    dashboardCopy.extensions = dashboardCopy.extensions || {};
    dashboardCopy.extensions.solutionsHive = dashboardCopy.extensions.solutionsHive || {};
    dashboardCopy.extensions.solutionsHive = {
      ...dashboardCopy.extensions.solutionsHive,
      uuid: dashboardCopy.extensions.solutionsHive.uuid || createUUID(),
      dbName: dbName,
    };

    const {uuid} = dashboardCopy.extensions.solutionsHive;
    const {title} = dashboardCopy;

    dispatch(updateHiveInformation('uuid', uuid));
    dispatch(updateHiveInformation('dbName', dbName));

    const baseNeoDashUrl = config('NEODASH_BASE_DEMO_URL');
    const url = `${baseNeoDashUrl}/?hivedashboarduuid=${uuid}`;

    const variables = {
      caller: 'NEODASH',
      cardInput: {
        solutionId: uuid,
        name: title,
        // type: 'neodash',
        type: 'demo',
        domain: 'public',
        image: '',
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
    selectedFile,
    dashboard,
    overwrite = false,
    updateSaveToHiveProgress,
    dbType,
    dbConnectionUrl,
    dbUsername,
    dbPassword,
    dbName,
  }) =>
  async (dispatch: any) => {
    updateSaveToHiveProgress({ flag: 'progress-bar' });
    const saveHiveCardArgs = {
      dispatch,
      dashboard,
      dbName,
      overwrite,
      dbType,
      dbConnectionUrl,
      dbUsername,
      dbPassword,
    };
    try {
      if (dbType === DatabaseUploadType.DatabaseUpload && selectedFile) {
        const formData = new FormData();
        const uploadUrl = config('FILE_UPLOAD_URL');
        const existingDbName = dashboard?.extensions?.solutionsHive?.dbName;
        if (overwrite && existingDbName) {
          formData.append('dbName', existingDbName);
          formData.append('overwrite', overwrite);
        }
        formData.append('databasedumpfile', selectedFile);
        // console.log('selectedFile: ', selectedFile);
        // console.log('formData: ', formData);
        fetch(uploadUrl, {
          method: 'POST',
          body: formData,
          headers: {
            // Content-Type": ""     // commenting it out so the browser will fill it in for me
          },
        })
          .then(async (response) => {
            console.log('response: ', response);
            let json = await response.json();
            console.log('json: ', json);
            let { dbName } = json;
            console.log('dbName: ', dbName);
            try {
              const hiveinfo = await saveDashboardToHiveGraphQL({
                ...saveHiveCardArgs,
                dbName: dbName,
                fileName: selectedFile?.name,
              });

              const savedId = hiveinfo?.response?.data?.mergeSolutionAndDashboard?.id;

              updateSaveToHiveProgress({
                flag: 'progress-instructions',
                dashboardUUID: savedId,
                solutionId: savedId,
                dbName: dbName,
              });
              // dispatch(createNotificationThunk('🎉 Success!', 'Your current dashboard was saved to Hive.'));
            } catch (e2) {
              console.log('saveDashboardToHiveThunk error: ', e2);
              dispatch(createNotificationThunk('Database uploaded, but could not save Dashboard', e2));
            }
          })
          .catch((err) => dispatch(createNotificationThunk('Unable to save dashboard to Hive (errno: 1)', err)));
      } else {
        const hiveinfo = await saveDashboardToHiveGraphQL({
          ...saveHiveCardArgs,
          fileName: '',
        });
        const savedId = hiveinfo?.response?.data?.mergeSolutionAndDashboard?.id;
        updateSaveToHiveProgress({
          flag: 'progress-instructions',
          dashboardUUID: savedId,
          solutionId: savedId,
        });
        // dispatch(createNotificationThunk('🎉 Success!', 'Your current dashboard was saved to Hive.'));
      }
    } catch (e) {
      dispatch(createNotificationThunk('Unable to save dashboard to Hive (errno: 2)', e));
    }
  };
