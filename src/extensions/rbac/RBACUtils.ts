import { QueryStatus, runCypherQuery } from '../../report/ReportQueryRunner';

export enum Operation {
  GRANT,
  DENY,
}

/**
 * Sets the privileges for a role to a new list provided by the user.
 * This involves wiping old priveleges, including a special case for '*' privileges.
 * @param driver the Neo4j driver.
 * @param database a database name for which privileges must be changed.
 * @param role role for which privileges are updated.
 * @param allLabels list of all labels in the given database.
 * @param newLabels list of new labels in the database, for which priveleges are changed.
 * @param operation The operation, either 'GRANT' or 'DENY'
 */
export const updatePriveleges = (driver, database, role, allLabels, newLabels, operation: Operation) => {
  // TODO - should we also drop cross-database DENYs (`ON GRAPH *`) to catch the true full set?

  // 1. Special case for '*'. Create it if needed to be there, otherwise revoke it.
  setTimeout(() => {
    runCypherQuery(driver, 'system', buildAccessQuery(database, role, ['*'], operation, !newLabels.includes('*')));
  }, 0);

  // 2. Build the query that revokes all possible priveleges, returning to a 'blank slate'
  setTimeout(() => {
    runCypherQuery(
      driver,
      'system',
      buildAccessQuery(
        database,
        role,
        allLabels.filter((l) => l !== '*'),
        operation,
        true
      )
    );
  }, 250);

  // 3. Create the new privileges as specified in the `newLabels` list by the user.
  setTimeout(() => {
    if (newLabels.filter((l) => l !== '*').length > 0) {
      runCypherQuery(
        driver,
        'system',
        buildAccessQuery(
          database,
          role,
          newLabels.filter((l) => l !== '*'),
          operation,
          false
        )
      );
    }
  }, 500);
};

/**
 * Generic query builder for adding/removing grants/denies for a list of labels.
 * @param database the database to grant/deny on.
 * @param role the role to create access rules for.
 * @param labels a list of node labels
 * @param access the access type. Can be "GRANT" or "DENY"
 * @param revoke Whether to revoke access or not.
 * @returns
 */
function buildAccessQuery(database, role, labels, operation: Operation, revoke: boolean): string {
  const query = `${revoke ? 'REVOKE' : ''} 
            ${operation == Operation.DENY ? 'DENY' : 'GRANT'} 
            MATCH {*} ON GRAPH ${database} 
            NODES ${labels.join(',')} 
            ${revoke ? 'FROM' : 'TO'} ${role}`;
  return query;
}

/**
 * Retrieve allow and deny lists for a selected role, and a given database.
 * @param driver Neo4j driver object.
 * @param database the user's selected database.
 * @param currentRole the user's selected role.
 * @param allLabels list of all labels in the database (retrieved seperately)
 * @param setLabels callback to update the list of all labels with any more that may only exist in priveleges
 * @param setAllowList callback to update the allow list retrieved from the database.
 * @param setDenyList callback to update the deny list retrieved from the database.
 * @param setLoaded callback to indicate the retrieval is completed.
 */
export const retrieveAllowAndDenyLists = (
  driver,
  database,
  currentRole,
  allLabels,
  setLabels,
  setAllowList,
  setDenyList,
  setLoaded
) => {
  runCypherQuery(
    driver,
    'system',
    `SHOW PRIVILEGES
      YIELD graph, role, access, action, segment
      WHERE (graph = $database OR graph = '*' OR graph = (CASE WHEN $database = 'neo4j' THEN '' ELSE null END ))
      AND role = $rolename
      AND action = 'match' 
      AND segment STARTS WITH 'NODE('
      RETURN access, collect(substring(segment, 5, size(segment)-6)) as nodes`,
    { rolename: currentRole, database: database },
    1000,
    () => {},
    (records) => {
      // Extract granted and denied label list from the result of the SHOW PRIVILEGES query
      const grants = records.filter((r) => r._fields[0] == 'GRANTED');
      const denies = records.filter((r) => r._fields[0] == 'DENIED');
      const grantedLabels = grants[0] ? [...new Set(grants[0]._fields[1])] : [];
      const deniedLabels = denies[0] ? [...new Set(denies[0]._fields[1])] : [];
      setAllowList(grantedLabels);
      setDenyList(deniedLabels);

      // Here we build a set of all POSSIBLE labels, that includes the list in the database, plus those in denies and grants.
      const possibleLabels = [...new Set(allLabels.concat(grantedLabels).concat(deniedLabels))];
      // Add '*' as an extra option.
      setLabels(['*'].concat(possibleLabels));
      setLoaded(true);
    },
    () => {
      // This is a new error callback. If the query fails, we still set loaded to true to show the rest of the modal.
      // setLoaded(true);
    }
  );
};

/**
 * Retrieve the set of all users from the database.
 * @param driver Neo4j driver object with active session.
 * @param setNeo4jUsers callback to update the list of users.
 */
export const retrieveNeo4jUsers = (driver, setNeo4jUsers) => {
  runCypherQuery(
    driver,
    'system',
    'SHOW users yield user return distinct user',
    {},
    1000,
    () => {},
    (records) => {
      setNeo4jUsers(records.map((record) => record._fields[0]));
    }
  );
};

/**
 * retrieve the list of labels in a given database from the dbms.
 * @param driver Neo4j driver object.
 * @param database selected database.
 * @param setLabels callback to update the list of labels.
 */
export function retrieveLabelsList(driver, database: any, setLabels: (records: any) => void) {
  runCypherQuery(
    driver,
    database.value,
    'CALL db.labels()',
    {},
    1000,
    () => {},
    (records) => setLabels(records)
  );
}

/**
 * retrieve the list of databases in a DBMS.
 * @param driver Neo4j driver with active session
 * @param setDatabases callback to update the list of databases.
 */
export function retrieveDatabaseList(driver, setDatabases: React.Dispatch<React.SetStateAction<never[]>>) {
  runCypherQuery(
    driver,
    'system',
    'SHOW DATABASES yield name return distinct name',
    {},
    1000,
    () => {},
    (records) => {
      setDatabases(records.map((record) => record._fields[0]));
    }
  );
}

/**
 * Updates the list of users for a given role.
 * This is a two step operation: clear the users assigned to the role currently, and recreate them with a new list.
 * @param driver Neo4j driver with active session.
 * @param currentRole selected role
 * @param selectedUsers list of users to have the role after the operation completes.
 */
export const updateUsers = (driver, currentRole, selectedUsers) => {
  // query to add new users: runCypherQuery(driver, 'system', `GRANT ROLE ${currentRole} TO ${selectedUsers.join(',')}`);
  // query to remove all users:
  console.log(driver, currentRole, selectedUsers);
  alert('NOT IMPLEMENTED');
};
