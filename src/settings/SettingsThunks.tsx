import { hardResetCardSettings, toggleCardSettings, toggleReportSettings } from "../card/CardActions";
import { createNotificationThunk } from "../page/PageThunks";
import { updateDashboardSetting } from "./SettingsActions";


const update = (state, mutations) =>
    Object.assign({}, state, mutations)


export const setPageNumberThunk = (number) => (dispatch: any, getState: any) => {
    try {
        dispatch(updateDashboardSetting("pagenumber", number))
        // Make sure that we don't have weird transitions with the settings popups.
        const page = getState().dashboard.pages[number];
        page.reports.map((report, i) => {
            dispatch(hardResetCardSettings(number, i))
        });
    } catch (e) {
        dispatch(createNotificationThunk("Unable to set page number", e));
    }
}

export const updateGlobalParameterThunk = (key, value) => (dispatch: any, getState: any) => {
    try {
        const settings = getState().dashboard.settings;
        const parameters = settings.parameters ? settings.parameters : {};
        if(value !== undefined){
            parameters[key] = value;
        }else{
            delete parameters[key];
        }
       
        dispatch(updateDashboardSetting("parameters", {...parameters}))
       
    } catch (e) {
        dispatch(createNotificationThunk("Unable to update global parameters", e));
    }
}
