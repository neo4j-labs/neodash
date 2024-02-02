// https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
export const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(`${response.status}: ${response.statusText}`);
  }
  return response;
};

export const getDbConnectionUrl = (dbConnection) =>
  `${dbConnection.protocol}://${dbConnection.url}${dbConnection.port ? `:${dbConnection.port}` : ''}`;
