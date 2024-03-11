import isEqual from 'lodash.isequal';
import {
  extractNodeAndRelPropertiesFromRecords,
  extractNodePropertiesFromRecords,
} from '../../report/ReportRecordProcessing';
import { QueryStatus } from '../interfaces';
import { setErrorDummy, setFieldsDummy, setRecordsDummy, setSchemaDummy, setStatusDummy } from './utils';

// TODO: create a readOnly version of this method or inject a property
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
export async function runCypherQuery({
  driver,
  database = '',
  query = '',
  parameters = {},
  rowLimit = 1000,
  fields = [],
  useNodePropsAsFields = false,
  useReturnValuesAsFields = false,
  useHardRowLimit = false,
  queryTimeLimit = 20,
  setSchema = (schema) => setSchemaDummy(schema),
  setStatus = (status) => setStatusDummy(status),
  setRecords = (records) => setRecordsDummy(records),
  setFields = (fields) => setFieldsDummy(fields),
  setError = (error) => setErrorDummy(error),
}) {
  // If no query specified, we don't do anything.
  if (query.trim() == '') {
    setFields([]);
    setStatus(QueryStatus.NO_QUERY);
    return;
  }
  if (!driver) {
    setStatus(QueryStatus.ERROR);
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

  await transaction
    .run(query, parameters)
    .then((res) => {
      // @ts-ignore
      const { records } = res;
      // TODO - check query summary to ensure that no writes are made in safe-mode.
      if (records.length == 0) {
        setStatus(QueryStatus.NO_DATA);
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

      setSchema(extractNodeAndRelPropertiesFromRecords(records));

      // QUERY RETURNED NO DRAWABLE DATA
      if (records == null) {
        setStatus(QueryStatus.NO_DRAWABLE_DATA);
        // console.log("TODO remove this - QUERY RETURNED NO DRAWABLE DATA!")
        transaction.commit();
        return;
        // QUERY RETURNED TO BE TRUNCATED
      } else if (records.length > rowLimit) {
        setStatus(QueryStatus.COMPLETE_TRUNCATED);
        setRecords(records.slice(0, rowLimit));
        transaction.commit();
        return;
      }
      // QUERY WAS EXECUTED SUCCESSFULLY
      setStatus(QueryStatus.COMPLETE);
      setRecords(records);

      transaction.commit();
    })
    .catch((e) => {
      // Process timeout errors.
      if (
        e.message.startsWith(
          'The transaction has been terminated. ' +
            'Retry your operation in a new transaction, and you should see a successful result. ' +
            'The transaction has not completed within the specified timeout (dbms.transaction.timeout).'
        )
      ) {
        // QUERY TIMED OUT
        setStatus(QueryStatus.TIMED_OUT);
        setRecords([{ error: e.message }]);
        transaction.rollback();
        return e.message;
      }
      // QUERY RAISED AN ERROR
      setStatus(QueryStatus.ERROR);
      // Process other errors.
      if (setRecords) {
        setError(e.message);
        setRecords([{ error: e.message }]);
      }
      transaction.rollback();
      return e.message;
    });
}
