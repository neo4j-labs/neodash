import { QueryParams, QueryCallback } from '../interfaces';

export const setSchemaDummy = (schema) => {
  // eslint-disable-next-line no-console
  console.log(`Query runner attempted to set schema: ${JSON.stringify(schema)}`);
};
export const setStatusDummy = (status) => {
  // eslint-disable-next-line no-console
  console.log(`Query runner attempted to set status: ${JSON.stringify(status)}`);
};
export const setRecordsDummy = (records) => {
  // eslint-disable-next-line no-console
  console.log(`Query runner attempted to set records: ${JSON.stringify(records)}`);
};
export const setFieldsDummy = (fields) => {
  // eslint-disable-next-line no-console
  console.log(`Query runner attempted to set fields: ${JSON.stringify(fields)}`);
};
export const setErrorDummy = (error) => {
  console.log(`Query runner attempted to set fields: ${JSON.stringify(error)}`);
};

export function extractQueryParams(queryParams): QueryParams {
  try {
    let { query } = queryParams;
    let database = queryParams.database ?? '';
    let parameters = queryParams.parameters ?? {};
    let rowLimit = queryParams.rowLimit ?? 1000;
    let fields = queryParams.fields ?? [];
    let useNodePropsAsFields = queryParams.useNodePropsAsFields ?? false;
    let useReturnValuesAsFields = queryParams.useReturnValuesAsFields ?? false;
    let useHardRowLimit = queryParams.useHardRowLimit ?? false;
    let queryTimeLimit = queryParams.queryTimeLimit ?? 20;
    return {
      query,
      database,
      parameters,
      rowLimit,
      fields,
      useNodePropsAsFields,
      useReturnValuesAsFields,
      useHardRowLimit,
      queryTimeLimit,
    };
  } catch (e) {
    console.log(`Couldn't extract parameters for Neo4jConnectionModule with error ${e}`);
    throw e;
  }
}

export function extractQueryCallbacks(callbacks): QueryCallback {
  try {
    let setRecords = callbacks.setRecords ?? setRecordsDummy;
    let setFields = callbacks.setFields ?? setFieldsDummy;
    let setError = callbacks.setError ?? setErrorDummy;
    let setStatus = callbacks.setStatus ?? setStatusDummy;
    let setSchema = callbacks.setSchema ?? setSchemaDummy;
    return { setRecords, setFields, setError, setStatus, setSchema };
  } catch (e) {
    console.log(`Couldn't extract callbacks for Neo4jConnectionModule with error ${e}`);
    throw e;
  }
}
