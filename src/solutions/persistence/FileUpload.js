import auth from '../auth/auth';
import { config } from '../config/dynamicConfig';

export const uploadFile = async ({ selectedFile, existingDbName, overwrite }) => {
  const formData = new FormData();
  const uploadUrl = config('FILE_UPLOAD_URL');
  if (overwrite && existingDbName) {
    formData.append('dbName', existingDbName);
    formData.append('overwrite', overwrite);
  }
  formData.append('databasedumpfile', selectedFile);
  // console.log('selectedFile: ', selectedFile);
  // console.log('formData: ', formData);
  return await fetch(uploadUrl, {
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
      let {
        dbName,
        newDbAdminUser,
        newDbAdminPassword,
        newDbReaderUser,
        newDbReaderPassword,
        neo4jBrowserUri,
        neo4jDriverUri,
      } = json;

      return {
        dbName,
        newDbAdminUser,
        newDbAdminPassword,
        newDbReaderUser,
        newDbReaderPassword,
        neo4jBrowserUri,
        neo4jDriverUri,
      };
    })
    .catch((err) => {
      throw err;
    });
};
