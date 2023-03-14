import { createUUID } from '../../dashboard/DashboardThunks';
import { createNotificationThunk } from '../../page/PageThunks';
import { config } from '../config/dynamicConfig';
import auth from '../auth/auth';
import { handleErrors } from '../util/util';
import { updateHiveInformation } from './HiveActions';
import { DatabaseUploadType } from '../config/SolutionsConstants';

const DashboardQuery = `
mutation UploadDashboard($input: UploadDashboardInput!) {
    uploadDashboard(input: $input)
}
`;

const CreateSolutionQuery = `
mutation CreateSolution($input: CreateSolutionInput!) {
    solution: createSolution(input: $input) {
      id
    }
  }
`;

const AddDeployment = `
mutation AddDeploymentToSolution($id: ID!, $name: String!, $url: String!) {
    solution: addDeploymentToSolution(id: $id, name: $name, url: $url) {
      id
      deployments {
        url
      }
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

const addDeployment = async ({ neoDashUuid, solutionId }) => {
  const baseNeoDashUrl = config('NEODASH_BASE_DEMO_URL');
  const url = `${baseNeoDashUrl}/?hivedashboarduuid=${neoDashUuid}`;
  const promise = new Promise((resolve, reject) => {
    const variables = {
      url: url,
      name: 'NeoDash Demo',
      id: solutionId,
    };

    const uri = config('HIVE_URI');
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: auth.getIdToken() ? `Bearer ${auth.getIdToken()}` : '',
      },
      body: JSON.stringify({
        query: AddDeployment,
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

const saveDemoCard = async ({ uuid, name }) => {
  console.log('TODO: use uuid: ', uuid);
  console.log('saveDemoCard name: ', name);
  const promise = new Promise((resolve, reject) => {
    const variables = {
      input: {
        name: name,
        type: 'demo',
        domain: 'public',
        image: '',
        github: '',
        caller: 'NEODASH',
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
        query: CreateSolutionQuery,
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

const saveDashboardToHiveGraphQL_Old = async ({
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
      uuid: dashboardCopy.extensions.solutionsHive.id || createUUID(),
      dbName: dbName,
    };

    const variables = {
      input: {
        uuid: dashboardCopy.extensions.solutionsHive.uuid,
        title: dashboardCopy.title,
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
        query: DashboardQuery,
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

const saveHiveCard = async ({
  dispatch,
  dashboard,
  dbName,
  overwrite,
  dbType,
  dbConnectionUrl,
  dbUsername,
  dbPassword,
  fileName,
}) => {
  try {
    const dashboardSaveResponse = await saveDashboardToHiveGraphQL_Old({
      dashboard,
      dbName,
      dbType,
      dbConnectionUrl,
      dbUsername,
      dbPassword,
      fileName,
    });
    const input = dashboardSaveResponse?.variables?.input || {};
    const { title, uuid } = input;

    dispatch(updateHiveInformation('uuid', uuid));
    dispatch(updateHiveInformation('dbName', dbName));

    console.log('title: ', title);
    let solutionId;
    if (!overwrite) {
      const saveCardResponse = await saveDemoCard({ uuid, name: title });
      solutionId = saveCardResponse?.data?.solution?.id;
      dispatch(updateHiveInformation('solutionId', solutionId));

      await addDeployment({ neoDashUuid: uuid, solutionId });
    }
    // updateSaveToHiveProgress(false);
    // dispatch(createNotificationThunk('🎉 Success!', 'Your current dashboard was saved to Hive.'));
    return { uuid: uuid, solutionId: solutionId };
  } catch (e2) {
    dispatch(createNotificationThunk('Database uploaded, but could not save Dashboard', e2));
  }
};

export const saveDashboardToHiveThunk =
  (
    driver,
    selectedFile,
    dashboard,
    date,
    user,
    overwrite = false,
    updateSaveToHiveProgress,
    dbType,
    dbConnectionUrl,
    dbUsername,
    dbPassword,
    dbName
  ) =>
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
      fileName,
    };
    try {
      if (dbType === DatabaseUploadType.NeoConnection) {
        const hiveinfo = await saveHiveCard({
          ...saveHiveCardArgs,
          fileName: '',
        });
        updateSaveToHiveProgress({
          flag: 'progress-instructions',
          dashboardUUID: hiveinfo?.uuid,
          solutionId: hiveinfo?.solutionId,
        });
        // dispatch(createNotificationThunk('🎉 Success!', 'Your current dashboard was saved to Hive.'));
      } else if (dbType === DatabaseUploadType.DatabaseUpload) {
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
            authorization: auth.getIdToken() ? `Bearer ${auth.getIdToken()}` : '',
          },
        })
          .then(async (response) => {
            console.log('response: ', response);
            let json = await response.json();
            console.log('json: ', json);
            let { dbName } = json;
            console.log('dbName: ', dbName);
            try {
              const hiveinfo = await saveHiveCard(
                dispatch,
                dashboard,
                dbName,
                overwrite,
                dbType,
                dbConnectionUrl,
                dbUsername,
                dbPassword,
                selectedFile?.name
              );
              updateSaveToHiveProgress({
                flag: 'progress-instructions',
                dashboardUUID: hiveinfo?.uuid,
                solutionId: hiveinfo?.solutionId,
                dbName: dbName,
              });
              // dispatch(createNotificationThunk('🎉 Success!', 'Your current dashboard was saved to Hive.'));
            } catch (e2) {
              dispatch(createNotificationThunk('Database uploaded, but could not save Dashboard', e2));
            }
          })
          .catch((err) => dispatch(createNotificationThunk('Unable to save dashboard to Hive (errno: 1)', err)));
      }
    } catch (e) {
      dispatch(createNotificationThunk('Unable to save dashboard to Hive (errno: 2)', e));
    }
  };
