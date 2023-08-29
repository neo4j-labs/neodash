import { getSessionStorageValue } from '../../sessionStorage/SessionStorageSelectors';

export const getPrepopulationReportExtensionSessionStorageKey = (cardId) => `prepopulation_report_extension__${cardId}`;

/**
 * An Extension can define a function to run before (prepopulate) the report itself
 * @param state State of the application
 * @param cardId Unique Id of the card running the report
 * @returns Name of the Extension to use to fetch the prepopulation function
 */
export const getPrepopulateReportExtension = (state: any, cardId: string) => {
  return getSessionStorageValue(state, getPrepopulationReportExtensionSessionStorageKey(cardId));
};
export const getExtensionActiveReducers = (state: any) => {
  return state.dashboard.extensions && state.dashboard.extensions.activeReducers;
};

export const getExtensionSettings = (state: any, name: string) => {
  let res = state.dashboard.extensions && state.dashboard.extensions[name];
  return res != undefined && res.settings ? res.settings : {};
};
