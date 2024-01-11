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
  updateSchema,
} from './CardActions';
import { createNotificationThunk } from '../page/PageThunks';
import { getReportTypes } from '../extensions/ExtensionUtils';
import isEqual from 'lodash.isequal';
import { SELECTION_TYPES } from '../config/CardConfig';
import { getSelectionBasedOnFields } from '../chart/ChartUtils';

export const updateReportTitleThunk = (id, title) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;
    dispatch(updateReportTitle(pagenumber, id, title));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot update report title', e));
  }
};

/*
Thunk used to update the database used from a report
*/
export const updateReportDatabaseThunk = (id, database) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;
    dispatch(updateReportDatabase(pagenumber, id, database));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot update report database', e));
  }
};

export const updateReportQueryThunk = (id, query) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;
    dispatch(updateReportQuery(pagenumber, id, query));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot update query', e));
  }
};

export const updateCypherParametersThunk = (id, parameters) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;
    dispatch(updateCypherParameters(pagenumber, id, parameters));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot update cypher parameters rate', e));
  }
};

export const updateReportTypeThunk = (id, type) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;

    dispatch(updateReportType(pagenumber, id, type));
    dispatch(updateFields(pagenumber, id, []));
    dispatch(updateSchema(pagenumber, id, []));
    dispatch(clearSelection(pagenumber, id));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot update report type', e));
  }
};

export const updateFieldsThunk =
  (id, fields, schema = false) =>
  (dispatch: any, getState: any) => {
    try {
      const state = getState();
      const { pagenumber } = state.dashboard.settings;
      const extensions = Object.fromEntries(Object.entries(state.dashboard.extensions).filter(([_, v]) => v.active));
      const oldReport = state.dashboard.pages[pagenumber].reports.find((o) => o.id === id);

      if (!oldReport) {
        return;
      }
      const oldFields = schema ? oldReport.schema : oldReport.fields;
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
              dispatch(updateSelection(pagenumber, id, selection, ['(none)']));
            } else {
              dispatch(updateSelection(pagenumber, id, selection, '(none)'));
            }
          } else if (fields.length > 0) {
            // For multi selections, select the Nth item of the result fields as a single item array.
            if (selectableFields[selection].multiple) {
              // only update if the old selection no longer covers the new set of fields...
              if (!oldSelection[selection] || !oldSelection[selection].every((v) => fields.includes(v))) {
                dispatch(updateSelection(pagenumber, id, selection, [fields[Math.min(i, fields.length - 1)]]));
              }
            } else if (selectableFields[selection].type == SELECTION_TYPES.NODE_PROPERTIES) {
              // For node property selections, select the most obvious properties of the node to display.
              const selection = getSelectionBasedOnFields(fields, oldSelection, autoAssignSelectedProperties);
              dispatch(updateAllSelections(pagenumber, id, selection));
            } else {
              // Else, default the selection to the Nth item of the result set fields.
              dispatch(updateSelection(pagenumber, id, selection, fields[Math.min(i, fields.length - 1)]));
            }
          }
        });
        // Set the new set of fields for the report so that we may select them.

        if (schema) {
          dispatch(updateSchema(pagenumber, id, fields));
        } else {
          dispatch(updateFields(pagenumber, id, fields));
        }
      }
    } catch (e) {
      dispatch(createNotificationThunk('Cannot update report fields', e));
    }
  };

export const updateSelectionThunk = (id, selectable, field) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;
    dispatch(updateSelection(pagenumber, id, selectable, field));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot update report selection', e));
  }
};

export const toggleCardSettingsThunk = (id, open) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;
    dispatch(toggleCardSettings(pagenumber, id, open));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot open card settings', e));
  }
};

export const updateReportSettingThunk = (id, setting, value) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const extensions = Object.fromEntries(Object.entries(state.dashboard.extensions).filter(([_, v]) => v.active));
    const { pagenumber } = state.dashboard.settings;

    // If we disable optional selections (e.g. grouping), we reset these selections to their none value.
    if (setting == 'showOptionalSelections' && value == false) {
      const reportType = state.dashboard.pages[pagenumber].reports.find((o) => o.id === id).type;
      const reportTypes = getReportTypes(extensions);
      const selectableFields = reportTypes[reportType].selection;
      const optionalSelectables = selectableFields
        ? Object.keys(selectableFields).filter((key) => selectableFields[key].optional)
        : [];
      optionalSelectables.forEach((selection) => {
        dispatch(updateSelection(pagenumber, id, selection, '(none)'));
      });
    }
    dispatch(updateReportSetting(pagenumber, id, setting, value));
  } catch (e) {
    dispatch(createNotificationThunk('Error when updating report settings', e));
  }
};
