export const getPageNumber = (state: any) => state.dashboard.settings.pagenumber;

export const getDashboardIsEditable = (state: any) =>
  state.dashboard.settings.editable && !state.application.standalone;

export const getGlobalParameters = (state: any) => state.dashboard.settings.parameters;

export const getSessionParameters = (state: any) => state.application.sessionParameters;

/*
The database related to a card is, at its start, the same as the one defined inside the application connection field, however
a user can modify the database that is used by a card with a new option inside the card itself.
 */
export const getDatabase = (state: any, pageNumber: number, cardIndex: number) => {
  if (state == undefined || pageNumber == undefined || cardIndex == undefined) {
    // TODO - use DMBS default database instead of neo4j.
    return 'neo4j';
  }
  if (
    state.dashboard.pages[pageNumber] == undefined ||
    state.dashboard.pages[pageNumber].reports[cardIndex] == undefined
  ) {
    // TODO - use DMBS default database instead of neo4j.
    return 'neo4j';
  }
  const reportDatabase = state.dashboard.pages[pageNumber].reports[cardIndex].database;
  if (reportDatabase !== undefined) {
    return reportDatabase;
  }
  return state.application.connection.database ? state.application.connection.database : 'neo4j';
};
