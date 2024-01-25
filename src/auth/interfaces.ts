export interface QueryParams {
  query: string;
  database?: string;
  parameters?: Record<any, any>;
  rowLimit?: number;
  fields?: never[];
  useNodePropsAsFields?: boolean;
  useReturnValuesAsFields?: boolean;
  useHardRowLimit?: boolean;
  queryTimeLimit?: number;
}

export interface QueryCallback {
  setRecords?;
  setFields?;
  setError?;
  setStatus?;
  setSchema?;
}

export enum QueryStatus {
  NO_QUERY, // No query specified
  NO_DATA, // No data was returned, therefore we can't draw it.
  NO_DRAWABLE_DATA, // There is data returned, but we can't draw it
  WAITING, // The report is waiting for custom logic to be executed.
  RUNNING, // The report query is running.
  TIMED_OUT, // Query has reached the time limit.
  COMPLETE, // There is data returned, and we can visualize it all.
  COMPLETE_TRUNCATED, // There is data returned, but it's too much so we truncate it.
  ERROR, // Something broke, likely the cypher query is invalid.
}
