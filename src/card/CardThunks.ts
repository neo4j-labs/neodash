import {
  updateReportTitle,
  updateReportQuery,
  updateSelection,
  updateCypherParameters,
  updateFields,
  updateReportType,
  updateReportSetting,
  toggleCardSettings,
  clearSelection,
  updateAllSelections,
  updateReportDatabase,
} from './CardActions';
import { createNotificationThunk } from '../page/PageThunks';
import { getReportTypes } from '../extensions/ExtensionUtils';
import isEqual from 'lodash.isequal';
import { SELECTION_TYPES } from '../config/CardConfig';
import { getSelectionBasedOnFields } from '../chart/ChartUtils';

export const updateReportTitleThunk = (reportId, title) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;
    dispatch(updateReportTitle(pagenumber, reportId, title));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot update report title', e));
  }
};

/*
Thunk used to update the database used from a report
*/
export const updateReportDatabaseThunk = (reportId, database) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;
    dispatch(updateReportDatabase(pagenumber, reportId, database));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot update report database', e));
  }
};

export const updateReportQueryThunk = (reportId, query) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;
    dispatch(updateReportQuery(pagenumber, reportId, query));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot update query', e));
  }
};

export const updateCypherParametersThunk = (reportId, parameters) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;
    dispatch(updateCypherParameters(pagenumber, reportId, parameters));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot update cypher parameters rate', e));
  }
};

export const updateReportTypeThunk = (reportId, type) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;

    dispatch(updateReportType(pagenumber, reportId, type));
    dispatch(updateFields(pagenumber, reportId, []));
    dispatch(clearSelection(pagenumber, reportId));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot update report type', e));
  }
};

export const updateFieldsThunk = (reportId, fields) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;
    const { extensions } = state.dashboard;
    const oldReport = state.dashboard.pages[pagenumber].reports.find((o) => o.id === reportId);
    if (!oldReport) {
      return;
    }
    const oldFields = oldReport.fields;
    const reportType = oldReport.type;
    const oldSelection = oldReport.selection;
    const reportTypes = getReportTypes(extensions);
    const selectableFields = reportTypes[reportType].selection; // The dictionary of selectable fields as defined in the config.
    const { autoAssignSelectedProperties } = reportTypes[reportType];
    const selectables = selectableFields ? Object.keys(selectableFields) : [];

    // If the new set of fields is not equal to the current set of fields, we ned to update the field selection.
    if (!isEqual(oldFields, fields) || Object.keys(oldSelection).length === 0) {
      selectables.forEach((selection, i) => {
        if (fields.includes(oldSelection[selection])) {
          // If the current selection is still present in the new set of fields, no need to reset.
          // Also we ignore this on a node property selector.
          /* continue */
        } else if (selectableFields[selection].optional) {
          // If the fields change, always set optional selections to none.
          if (selectableFields[selection].multiple) {
            dispatch(updateSelection(pagenumber, reportId, selection, ['(none)']));
          } else {
            dispatch(updateSelection(pagenumber, reportId, selection, '(none)'));
          }
        } else if (fields.length > 0) {
          // For multi selections, select the Nth item of the result fields as a single item array.
          if (selectableFields[selection].multiple) {
            // only update if the old selection no longer covers the new set of fields...
            if (!oldSelection[selection] || !oldSelection[selection].every((v) => fields.includes(v))) {
              dispatch(updateSelection(pagenumber, reportId, selection, [fields[Math.min(i, fields.length - 1)]]));
            }
          } else if (selectableFields[selection].type == SELECTION_TYPES.NODE_PROPERTIES) {
            // For node property selections, select the most obvious properties of the node to display.
            const selection = getSelectionBasedOnFields(fields, oldSelection, autoAssignSelectedProperties);
            dispatch(updateAllSelections(pagenumber, reportId, selection));
          } else {
            // Else, default the selection to the Nth item of the result set fields.
            dispatch(updateSelection(pagenumber, reportId, selection, fields[Math.min(i, fields.length - 1)]));
          }
        }
      });
      // Set the new set of fields for the report so that we may select them.
      dispatch(updateFields(pagenumber, reportId, fields));
    }
  } catch (e) {
    dispatch(createNotificationThunk('Cannot update report fields', e));
  }
};

export const updateSelectionThunk = (reportId, selectable, field) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;
    dispatch(updateSelection(pagenumber, reportId, selectable, field));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot update report selection', e));
  }
};

export const toggleCardSettingsThunk = (reportId, open) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;
    dispatch(toggleCardSettings(pagenumber, reportId, open));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot open card settings', e));
  }
};

export const updateReportSettingThunk = (reportId, setting, value) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { extensions } = state.dashboard;
    const { pagenumber } = state.dashboard.settings;

    // If we disable optional selections (e.g. grouping), we reset these selections to their none value.
    if (setting == 'showOptionalSelections' && value == false) {
      const reportType = state.dashboard.pages[pagenumber].reports.find((o) => o.id === reportId).type;
      const reportTypes = getReportTypes(extensions);
      const selectableFields = reportTypes[reportType].selection;
      const optionalSelectables = selectableFields
        ? Object.keys(selectableFields).filter((key) => selectableFields[key].optional)
        : [];
      optionalSelectables.forEach((selection) => {
        dispatch(updateSelection(pagenumber, reportId, selection, '(none)'));
      });
    }
    dispatch(updateReportSetting(pagenumber, reportId, setting, value));
  } catch (e) {
    dispatch(createNotificationThunk('Error when updating report settings', e));
  }
};
