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
     
        // Attempt upgrade
        if(dashboard["version"] == "1.1"){
            const upgradedDashboard = {};
            upgradedDashboard["title"] = dashboard["title"];
            upgradedDashboard["version"] = "2.0";
            upgradedDashboard["settings"] = {
                pagenumber: dashboard["pagenumber"],
                editable: dashboard["editable"]
            };
            const upgradedDashboardPages = [];
            dashboard["pages"].forEach(p => {
                const newPage = {};
                newPage["title"] = p["title"];
                const newPageReports = [];
                p["reports"].forEach(r => {
                    // only migrate value report types.
                    if(["table", "graph", "bar", "line", "map", "value", "json", "select", "iframe", "text"].indexOf(r["type"]) == -1){
                        return
                    }
                    if(r["type"] == "select"){
                        r["query"] = "";
                    }
                    const newPageReport = {
                        title: r["title"],
                        width: r["width"],
                        height: r["height"] * 0.75,
                        type: r["type"],
                        parameters: r["parameters"],
                        query: r["query"],
                        selection: {},
                        settings: {} 
                    }
                   
                    newPageReports.push(newPageReport);
                })
                newPage["reports"] = newPageReports;
                upgradedDashboardPages.push(newPage);
            })
            upgradedDashboard["pages"] = upgradedDashboardPages;

            dispatch(setDashboard(upgradedDashboard))
            dispatch(createNotificationThunk("Successfully upgraded dashboard", "Your old dashboard was migrated to version 2.0. You might need to refresh this page."));
            return 
        }
        if(dashboard["version"] != "2.0"){
            throw ("Invalid dashboard version: "+dashboard.version);
        }
      
        dispatch(setDashboard(dashboard))

    } catch (e) {
        dispatch(createNotificationThunk("Unable to load dashboard", e));
    }
}