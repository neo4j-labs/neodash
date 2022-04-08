import { createNotificationThunk } from "../page/PageThunks";
import { updateDashboardSetting } from "../settings/SettingsActions";
import { addPage, removePage, resetDashboardState, setDashboard } from "./DashboardActions";
import { runCypherQuery } from "../report/ReportQueryRunner";
import { setParametersToLoadAfterConnecting, setWelcomeScreenOpen } from "../application/ApplicationActions";
import { updateGlobalParametersThunk } from "../settings/SettingsThunks";


function createUUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}


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
        if (text.length == 0) {
            throw ("No dashboard file specified. Did you select a file?")
        }
        if (text.trim() == "{}") {
            dispatch(resetDashboardState());
            return
        }
        const dashboard = JSON.parse(text);

        // Attempt upgrade
        if (dashboard["version"] == "1.1") {
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
                    if (["table", "graph", "bar", "line", "map", "value", "json", "select", "iframe", "text"].indexOf(r["type"]) == -1) {
                        return
                    }
                    if (r["type"] == "select") {
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
            dispatch(setWelcomeScreenOpen(false))
            dispatch(createNotificationThunk("Successfully upgraded dashboard", "Your old dashboard was migrated to version 2.0. You might need to refresh this page."));
            return
        }
        if (dashboard["version"] != "2.0") {
            throw ("Invalid dashboard version: " + dashboard.version);
        }

        // Reverse engineer the minimal set of fields from the selection loaded.
        dashboard.pages.forEach(p => {
            p.reports.forEach(r => {
                if (r.selection) {
                    r["fields"] = []
                    Object.keys(r.selection).forEach(f => {
                        r["fields"].push([f, r.selection[f]])
                    })
                }
            })
        })
        dispatch(setDashboard(dashboard));
        const application = getState().application;
        dispatch(updateGlobalParametersThunk(application.parametersToLoadAfterConnecting));
        dispatch(setParametersToLoadAfterConnecting(null))

    } catch (e) {
        dispatch(createNotificationThunk("Unable to load dashboard", e));
    }
}

export const saveDashboardToNeo4jThunk = (driver, database, dashboard, date, user, overwrite = false) => (dispatch: any, getState: any) => {
    try {
        const uuid = createUUID();
        const title = dashboard.title;
        const version = dashboard.version;
        const content = dashboard;


        // Generate a cypher query to save the dashboard.
        const query = (overwrite) ?
            "OPTIONAL MATCH (n:_Neodash_Dashboard{title:$title}) DELETE n WITH 1 as X LIMIT 1 CREATE (n:_Neodash_Dashboard) SET n.uuid = $uuid, n.title = $title, n.version = $version, n.user = $user, n.content = $content, n.date = datetime($date) RETURN $uuid as uuid" :
            "CREATE (n:_Neodash_Dashboard) SET n.uuid = $uuid, n.title = $title, n.version = $version, n.user = $user, n.content = $content, n.date = datetime($date) RETURN $uuid as uuid";
        runCypherQuery(driver, database,
            query,
            { uuid: uuid, title: title, version: version, user: user, content: JSON.stringify(dashboard, null, 2), date: date },
            {}, ["uuid"], 1, () => { return }, (records) => {
                if (records && records[0] && records[0]["_fields"] && records[0]["_fields"][0] && records[0]["_fields"][0] == uuid) {
                    dispatch(createNotificationThunk("🎉 Success!", "Your current dashboard was saved to Neo4j."));
                } else {
                    dispatch(createNotificationThunk("Unable to save dashboard", "Do you have write access to the '" + database + "' database?"));
                }

            });

    } catch (e) {
        dispatch(createNotificationThunk("Unable to save dashboard to Neo4j", e));
    }
}

export const loadDashboardFromNeo4jByUUIDThunk = (driver, database, uuid, callback) => (dispatch: any, getState: any) => {
    try {
        runCypherQuery(driver, database, "MATCH (n:_Neodash_Dashboard) WHERE n.uuid = $uuid RETURN n.content as dashboard", { uuid: uuid }, {}, ["dashboard"], 1, () => { return }, (records) => {
            if (records.length == 0) {
                dispatch(createNotificationThunk("Unable to load dashboard.", "A dashboard with the provided UUID could not be found."));
            }
            callback(records[0]['_fields'][0])
        }
        )
    } catch (e) {
        dispatch(createNotificationThunk("Unable to load dashboard to Neo4j", e));
    }
}

export const loadDashboardFromNeo4jByNameThunk = (driver, database, name, callback) => (dispatch: any, getState: any) => {
    try {
        runCypherQuery(driver, database, "MATCH (d:_Neodash_Dashboard) WHERE d.title = $name RETURN d.content as dashboard ORDER by d.date DESC LIMIT 1", { name: name }, {}, ["dashboard"], 1, () => { return }, (records) => {
            if (records.length == 0) {
                dispatch(createNotificationThunk("Unable to load dashboard.", "A dashboard with the provided name could not be found."));
            }
            callback(records[0]['_fields'][0])
        })
    } catch (e) {
        dispatch(createNotificationThunk("Unable to load dashboard from Neo4j", e));
    }
}

export const loadDashboardListFromNeo4jThunk = (driver, database, callback) => (dispatch: any, getState: any) => {
    try {
        runCypherQuery(driver, database,
            "MATCH (n:_Neodash_Dashboard) RETURN n.uuid as id, n.title as title, toString(n.date) as date, n.user as author ORDER BY date DESC",
            {}, {}, ["id, title, date, user"], 1000, () => { return }, (records) => {
                if (!records || !records[0] || !records[0]["_fields"]) {
                    callback([]);
                    return
                }
                const result = records.map(r => {
                    return { id: r["_fields"][0], title: r["_fields"][1], date: r["_fields"][2], author: r["_fields"][3] };
                });
                callback(result);
            })
    } catch (e) {
        dispatch(createNotificationThunk("Unable to load dashboard list from Neo4j", e));
    }
}

export const loadDatabaseListFromNeo4jThunk = (driver, callback) => (dispatch: any, getState: any) => {
    try {
        runCypherQuery(driver, "system",
            "SHOW DATABASES yield name RETURN name",
            {}, {}, ["name"], 1000, () => { return }, (records) => {
                const result = records.map(r => {
                    return r["_fields"][0];
                });
                callback(result);
            })
    } catch (e) {
        dispatch(createNotificationThunk("Unable to list databases from Neo4j", e));
    }
}

