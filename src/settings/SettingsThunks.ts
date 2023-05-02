import { setSessionParameters } from '../application/ApplicationActions';
import { hardResetCardSettings } from '../card/CardActions';
import { castToNeo4jDate, isCastableToNeo4jDate, valueIsNode } from '../chart/ChartUtils';
import { createNotificationThunk } from '../page/PageThunks';
import { updateDashboardSetting } from './SettingsActions';

export const setPageNumberThunk = (number) => (dispatch: any, getState: any) => {
  try {
    if (number == undefined) {
      throw 'The specified page could not be found, was it moved, removed, or renamed?';
    }
    const { pages } = getState().dashboard;
    // Make sure the page number is within bounds.
    number = Math.max(0, Math.min(pages.length - 1, number));
    dispatch(updateDashboardSetting('pagenumber', number));
    // Make sure that we don't have weird transitions with the settings popups.

    const page = pages[number];
    page.reports.map((report, i) => {
      dispatch(hardResetCardSettings(number, i));
    });
  } catch (e) {
    dispatch(createNotificationThunk('Unable to set page number', e));
  }
};

export const updateGlobalParameterThunk = (key, value) => (dispatch: any, getState: any) => {
  try {
    const { settings } = getState().dashboard;
    const parameters = settings.parameters ? settings.parameters : {};
    if (value !== undefined) {
      let valueFinal = valueIsNode(value) ? Object.assign({}, value) : value;
      parameters[key] = valueFinal;
    } else {
      delete parameters[key];
    }

    dispatch(updateDashboardSetting('parameters', { ...parameters }));
  } catch (e) {
    dispatch(createNotificationThunk('Unable to update global parameter', e));
  }
};

export const updateSessionParameterThunk = (key, value) => (dispatch: any, getState: any) => {
  try {
    const { application } = getState();
    const parameters = application.sessionParameters ? application.sessionParameters : {};
    if (value !== undefined) {
      parameters[key] = value;
    } else {
      delete parameters[key];
    }

    dispatch(setSessionParameters({ ...parameters }));
  } catch (e) {
    dispatch(createNotificationThunk('Unable to update session parameter', e));
  }
};

export const updateGlobalParametersThunk = (newParameters) => (dispatch: any, getState: any) => {
  try {
    const { settings } = getState().dashboard;
    const parameters = settings.parameters ? settings.parameters : {};

    // if new parameters are set...
    if (newParameters) {
      // iterate over the key value pairs in parameters
      Object.keys(newParameters).forEach((key) => {
        if (newParameters[key] !== undefined) {
          parameters[key] = newParameters[key];
        } else {
          delete parameters[key];
        }
      });
      dispatch(updateDashboardSetting('parameters', { ...parameters }));
    }
  } catch (e) {
    dispatch(createNotificationThunk('Unable to update global parameters', e));
  }
};

/**
 * Casting complex params to Neo4j type (right now just dates)
 */
export const updateParametersToNeo4jTypeThunk = () => (dispatch: any, getState: any) => {
  try {
    const { settings } = getState().dashboard;
    const parameters = settings.parameters ? settings.parameters : {};

    // if new parameters are set...
    // iterate over the key value pairs in parameters
    Object.keys(parameters).forEach((key) => {
      if (isCastableToNeo4jDate(parameters[key])) {
        parameters[key] = castToNeo4jDate(parameters[key]);
      } else if (parameters[key] === undefined) {
        delete parameters[key];
      }
    });
    dispatch(updateDashboardSetting('parameters', { ...parameters }));
  } catch (e) {
    dispatch(createNotificationThunk('Unable to update cached parameters to Neo4j types', e));
  }
};
