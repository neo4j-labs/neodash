import { deleteSessionStorageValue, setSessionStorageValue } from '../../sessionStorage/SessionStorageActions';
import { getPrepopulationReportExtensionSessionStorageKey } from './ExtensionSelectors';

/**
 * We want to register new reducers to the extension reducer but only if
 * that extension is enabled
 */
export const SET_EXTENSION_REDUCER_ENABLED = 'DASHBOARD/EXTENSIONS/SET_EXTENSION_REDUCER_ENABLED';
export const setExtensionReducerEnabled = (name: string, enabled: boolean) => ({
  type: SET_EXTENSION_REDUCER_ENABLED,
  payload: { name, enabled },
});

export const setSessionStoragePrepopulationReportFunction = (reportId, extensionName) =>
  setSessionStorageValue(getPrepopulationReportExtensionSessionStorageKey(reportId), extensionName);

export const deleteSessionStoragePrepopulationReportFunction = (reportId) =>
  deleteSessionStorageValue(getPrepopulationReportExtensionSessionStorageKey(reportId));
