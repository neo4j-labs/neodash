import { extractNodePropertiesFromRecords } from './ReportRecordProcessing';
import isEqual from 'lodash.isequal';

export enum QueryStatus {
  NO_QUERY, // No query specified
  NO_DATA, // No data was returned, therefore we can't draw it.
  NO_DRAWABLE_DATA, // There is data returned, but we can't draw it
  RUNNING, // The report query is running.
  TIMED_OUT, // Query has reached the time limit.
  COMPLETE, // There is data returned, and we can visualize it all.
  COMPLETE_TRUNCATED, // There is data returned, but it's too much so we truncate it.
  ERROR, // Something broke, likely the cypher query is invalid.
}

/**
 * Runs a Cypher query using the specified driver.
 * @param driver - an instance of a Neo4j driver.
 * @param database - optionally, the Neo4j database to run the query against.
 * @param query - the cypher query to run.
 * @param parameters - an optional set of query parameters.
 * @param rowLimit - optionally, the maximum number of rows to retrieve.
 * @param setStatus - callback to retrieve query status.
 * @param setRecords  - callback to retrieve query records.
 * @param setFields - callback to set list of returned query fields.
 * @param queryTimeLimit - maximum query time in seconds.
 * @returns
 */
export function runCypherQuery(
  driver,
  database = '',
  query = '',
  parameters = {},
  rowLimit = 1000,
  setStatus = (status) => {
    // eslint-disable-next-line no-console
    console.log(`Query runner attempted to set status: ${JSON.stringify(status)}`);
  },
  setRecords = (records) => {
    // eslint-disable-next-line no-console
    console.log(`Query runner attempted to set records: ${JSON.stringify(records)}`);
  },
  setFields = (fields) => {
    // eslint-disable-next-line no-console
    console.log(`Query runner attempted to set fields: ${JSON.stringify(fields)}`);
  },
  fields = [],
  useNodePropsAsFields = false,
  useReturnValuesAsFields = false,
  useHardRowLimit = false,
  queryTimeLimit = 20
) {
  // If no query specified, we don't do anything.
  if (query.trim() == '') {
    setFields([]);
    setStatus(QueryStatus.NO_QUERY);
    return;
  }

  const session = database ? driver.session({ database: database }) : driver.session();
  const transaction = session.beginTransaction({ timeout: queryTimeLimit * 1000, connectionTimeout: 2000 });

  // For usuability reasons, we can set a hard cap on the query result size by wrapping it a subquery (Neo4j 4.0 and later).
  // This unfortunately does not preserve ordering on the return fields.
  // If we are on Neo4j 4.0 or later, we can use subqueries to smartly limit the result set size based on report type.
  if (useHardRowLimit && Object.values(driver._connectionProvider._openConnections).length > 0) {
    // @ts-ignore
    const dbVersion = Object.values(driver._connectionProvider._openConnections)[0]._server.version;
    if (!dbVersion.startsWith('Neo4j/3.')) {
      query = `CALL { ${query}} RETURN * LIMIT ${rowLimit + 1}`;
    }
  }
  transaction
    .run(query, parameters)
    .then((res) => {
      // @ts-ignore
      const { records } = res;
      // TODO - check query summary to ensure that no writes are made in safe-mode.
      if (records.length == 0) {
        setStatus(QueryStatus.NO_DATA);
        // console.log("TODO remove this - QUERY RETURNED NO DATA!")
        transaction.commit();
        return;
      }

      if (useReturnValuesAsFields) {
        // Send a deep copy of the returned record keys as the set of fields.
        const newFields = records && records[0] && records[0].keys ? records[0].keys.slice() : [];

        if (!isEqual(newFields, fields)) {
          setFields(newFields);
        }
      } else if (useNodePropsAsFields) {
        // If we don't use dynamic field mapping, but we do have a selection, use the discovered node properties as fields.
        const nodePropsAsFields = extractNodePropertiesFromRecords(records);
        setFields(nodePropsAsFields);
      }

      if (records == null) {
        setStatus(QueryStatus.NO_DRAWABLE_DATA);
        // console.log("TODO remove this - QUERY RETURNED NO DRAWABLE DATA!")
        transaction.commit();
        return;
      } else if (records.length > rowLimit) {
        setRecords(records.slice(0, rowLimit));
        setStatus(QueryStatus.COMPLETE_TRUNCATED);
        // console.log("TODO remove this - QUERY RETURNED WAS TRUNCTURED!")
        transaction.commit();
        return;
      }
      setStatus(QueryStatus.COMPLETE);
      setRecords(records);
      // console.log("TODO remove this - QUERY WAS EXECUTED SUCCESFULLY!")

      transaction.commit();
    })
    .catch((e) => {
      // setFields([]);

      // Process timeout errors.
      if (
        e.message.startsWith(
          'The transaction has been terminated. ' +
            'Retry your operation in a new transaction, and you should see a successful result. ' +
            'The transaction has not completed within the specified timeout (dbms.transaction.timeout).'
        )
      ) {
        setRecords([{ error: e.message }]);
        transaction.rollback();
        setStatus(QueryStatus.TIMED_OUT);
        return e.message;
      }

      // Process other errors.
      if (setRecords) {
        setRecords([{ error: e.message }]);
      }
      transaction.rollback();
      setStatus(QueryStatus.ERROR);
      return e.message;
    });
}
