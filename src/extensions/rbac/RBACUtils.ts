import { QueryStatus, runCypherQuery } from '../../report/ReportQueryRunner';

export enum Operation {
  GRANT,
  DENY,
}

/**
 * Sets the privileges for a role to a new list provided by the user.
 * This involves wiping old privileges, including a special case for '*' privileges.
 * @param driver the Neo4j driver.
 * @param database a database name for which Privileges must be changed.
 * @param role role for which privileges are updated.
 * @param allLabels list of all labels in the given database.
 * @param newLabels list of new labels in the database, for which priveleges are changed.
 * @param operation The operation, either 'GRANT' or 'DENY'
 */
export async function updatePrivileges(
  driver,
  database,
  role,
  allLabels,
  newLabels,
  operation: Operation,
  onSuccess,
  onFail
) {
  // TODO - should we also drop cross-database DENYs (`ON GRAPH *`) to catch the true full set?
  // TODO - there
  // 1. Special case for '*'. Create it if needed to be there, otherwise revoke it.
  runCypherQuery(
    driver,
    'system',
    buildAccessQuery(database, role, ['*'], operation, !newLabels.includes('*')),
    {},
    1000,
    (status) => {
      if (status == QueryStatus.NO_DATA || QueryStatus.COMPLETE) {
        // 2. Build the query that revokes all possible priveleges, returning to a 'blank slate'
        runCypherQuery(
          driver,
          'system',
          buildAccessQuery(
            database,
            role,
            allLabels.filter((l) => l !== '*'),
            operation,
            true
          ),
          {},
          1000,
          (status) => {
            if (status == QueryStatus.NO_DATA || status == QueryStatus.COMPLETE) {
              //  TODO: Neo4j is very slow in updating after the previous query, even though it is technically a finished query.
              // We build in an artificial delay...
              const timeout = setTimeout(() => {
                // 3. Create the new privileges as specified in the `newLabels` list by the user.
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
                    ),
                    {},
                    1000,
                    (status) => {
                      if (status == QueryStatus.NO_DATA || status == QueryStatus.COMPLETE) {
                        onSuccess();
                      }
                    },
                    (records) => {
                      if (records && records[0] && records[0].error) {
                        onFail(records[0].error);
                      }
                    }
                  );
                } else {
                  onSuccess();
                }
              }, 1000);
            }
          },
          (records) => {
            if (records && records[0] && records[0].error) {
              onFail(records[0].error);
            }
          }
        );
      }
    },
    (records) => {
      if (records && records[0] && records[0].error) {
        onFail(records[0].error);
      }
    }
  );
}

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
  setFixedAllowList,
  setFixedDenyList,
  setLoaded
) => {
  runCypherQuery(
    driver,
    'system',
    `SHOW PRIVILEGES
      YIELD graph, role, access, action, segment
      WHERE (graph = $database OR graph = '*')
      AND role = $rolename
      AND action = 'match' 
      AND segment STARTS WITH 'NODE('
      RETURN access, collect(substring(segment, 5, size(segment)-6)) as nodes, graph = "*" as fixed`,
    { rolename: currentRole, database: database },
    1000,
    (status) => {
      if (status == QueryStatus.NO_DATA) {
        setLabels(['*'].concat(allLabels));
        setLoaded(true);
      }
    },
    (records) => {
      // Extract granted and denied label list from the result of the SHOW PRIVILEGES query
      const grants = records.filter((r) => r._fields[0] == 'GRANTED' && r._fields[2] == false);
      const denies = records.filter((r) => r._fields[0] == 'DENIED' && r._fields[2] == false);
      const grantedLabels = grants[0] ? [...new Set(grants[0]._fields[1])] : [];
      const deniedLabels = denies[0] ? [...new Set(denies[0]._fields[1])] : [];

      // Do the same for fixed grants (those stored under the '*' graph permission)
      const fixedGrants = records.filter((r) => r._fields[0] == 'GRANTED' && r._fields[2] == true);
      const fixedDenies = records.filter((r) => r._fields[0] == 'DENIED' && r._fields[2] == true);
      const fixedGrantedLabels = fixedGrants[0] ? [...new Set(fixedGrants[0]._fields[1])] : [];
      const fixedDeniedLabels = fixedDenies[0] ? [...new Set(fixedDenies[0]._fields[1])] : [];

      setAllowList([...new Set(grantedLabels.concat(fixedGrantedLabels))]);
      setDenyList([...new Set(deniedLabels.concat(fixedDeniedLabels))]);
      setFixedAllowList(fixedGrantedLabels);
      setFixedDenyList(fixedDeniedLabels);

      // Here we build a set of all POSSIBLE labels, that includes the list in the database, plus those in denies and grants.
      const possibleLabels = [...new Set(allLabels.concat(grantedLabels).concat(deniedLabels))];
      // Add '*' as an extra option.
      setLabels(['*'].concat(possibleLabels));
      setLoaded(true);
    }
  );
};

/**
 * Retrieve the set of all users from the database.
 * @param driver Neo4j driver object with active session.
 * @param  currentRole selected role.
 * @param setNeo4jUsers callback to update the list of all users.
 * @param setRoleUsers callback to update the list of role-specific users.
 */
export const retrieveNeo4jUsers = (driver, currentRole, setNeo4jUsers, setRoleUsers) => {
  runCypherQuery(
    driver,
    'system',
    'SHOW users yield user, roles return user, roles',
    {},
    1000,
    () => {},
    (records) => {
      const roleRecords = records.filter((r) => r._fields[1].includes(currentRole));
      setRoleUsers(roleRecords.map((record) => record._fields[0]));
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
  let labelsSet = false; // Flag to track if setLabels was called

  // Wrapper around the original setLabels to set the flag when called
  const wrappedSetLabels = (records) => {
    labelsSet = true;
    setLabels(records);
  };

  runCypherQuery(driver, database, 'CALL db.labels()', {}, 1000, () => {}, wrappedSetLabels)
    .then(() => {
      if (!labelsSet) {
        setLabels([]);
      }
    })
    .catch((error) => {
      console.error('Error retrieving labels:', error);
      setLabels([]);
    });
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
 * @param allUsers list of all users.
 * @param selectedUsers list of users to have the role after the operation completes.
 */
export async function updateUsers(driver, currentRole, allUsers, selectedUsers, onSuccess, onFail) {
  // 1. Build the query that removes all users from the role.
  let globalStatus = -1;
  const escapedAllUsers = allUsers.map((user) => `\`${user}\``).join(',');
  await runCypherQuery(
    driver,
    'system',
    `REVOKE ROLE ${currentRole} FROM ${escapedAllUsers}`,
    {},
    1000,
    async (status) => {
      globalStatus = status;
      if (globalStatus == QueryStatus.NO_DATA || globalStatus == QueryStatus.COMPLETE) {
        //  TODO: Neo4j is very slow in updating after the previous query, even though it is technically a finished query.
        // We build in an artificial delay... This must be improved the future.
        setTimeout(async () => {
          if (selectedUsers.length > 0) {
            const escapedSelectedUsers = selectedUsers.map((user) => `\`${user}\``).join(',');
            await runCypherQuery(
              driver,
              'system',
              `GRANT ROLE ${currentRole} TO ${escapedSelectedUsers};`,
              {},
              1000,
              (status) => {
                if (status == QueryStatus.NO_DATA || QueryStatus.COMPLETE) {
                  onSuccess();
                }
              }
            );
          } else {
            onSuccess();
          }
        }, 2000);
      }
    },
    (records) => {
      if (records && records[0] && records[0].error) {
        onFail(records[0].error);
      }
    }
  );
}
