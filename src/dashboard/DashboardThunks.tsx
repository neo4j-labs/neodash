import { createNotificationThunk } from "../page/PageThunks";
import { setPageNumber, updateDashboardSetting } from "../settings/SettingsActions";
import { addPage, removePage, resetDashboardState, setDashboard } from "./DashboardActions";


export const removePageThunk = (number) => (dispatch: any, getState: any) => {
    try {
        const numberOfPages = getState().dashboard.pages.length;

        if (numberOfPages == 1) {
            dispatch(createNotificationThunk("Cannot remove page", "You can't remove the only page of a dashboard."))
            return
        }
        if (number >= numberOfPages - 1) {
            dispatch(updateDashboardSetting("pagenumber", numberOfPages - 2))
        }
        dispatch(removePage(number))
    } catch (e) {
        dispatch(createNotificationThunk("Unable to remove page", e));
    }
}

export const addPageThunk = () => (dispatch: any, getState: any) => {
    try {
        const numberOfPages = getState().dashboard.pages.length;
        dispatch(addPage())
        dispatch(updateDashboardSetting("pagenumber", numberOfPages))
    } catch (e) {
        dispatch(createNotificationThunk("Unable to create page", e));
    }
}

export const loadDashboardThunk = (text) => (dispatch: any, getState: any) => {
    try {
        if(text.length == 0){
            throw("No dashboard file specified. Did you select a file?")
        }
        if(text.trim() == "{}"){
            dispatch(resetDashboardState());
            return 
        }
        const dashboard = JSON.parse(text);
     
        if(dashboard["version"] != "2.0"){
            throw ("Invalid dashboard version: "+dashboard.version);
        }
      
        dispatch(setDashboard(dashboard))

    } catch (e) {
        dispatch(createNotificationThunk("Unable to load dashboard", e));
    }
}