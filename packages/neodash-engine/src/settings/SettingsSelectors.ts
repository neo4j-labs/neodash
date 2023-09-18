export const getPageNumber = (state: any) => state.dashboard.settings.pagenumber;

export const getDashboardIsEditable = (state: any) =>
  state.dashboard.settings.editable && !state.application.standalone;

export const getGlobalParameters = (state: any) => state.dashboard.settings.parameters;

export const getSessionParameters = (state: any) => state.application.sessionParameters;

/*
The database related to a card is, at its start, the same as the one defined inside the application connection field, however
a user can modify the database that is used by a card with a new option inside the card itself.
TODO: too overloaded, define two different functions based on the scope (global db or card specific db)
 */
export const getDatabase = (state: any, pagenumber: number, id: number) => {
  if (state == undefined || pagenumber == undefined || id == undefined) {
    // TODO - use DMBS default database instead of neo4j.
    return 'neo4j';
  }
  if (
    state.dashboard.pages[pagenumber] == undefined ||
    state.dashboard.pages[pagenumber].reports.find((o) => o.id === id) == undefined
  ) {
    // TODO - use DMBS default database instead of neo4j.
    return 'neo4j';
  }
  const reportDatabase = state.dashboard.pages[pagenumber].reports.find((o) => o.id === id).database;
  if (reportDatabase !== undefined) {
    return reportDatabase;
  }
  return state.application.connection.database ? state.application.connection.database : 'neo4j';
};
