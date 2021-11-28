import { createDriver } from "use-neo4j";
import { createNotificationThunk } from "../page/PageThunks";
import { QueryStatus, runCypherQuery } from "../report/CypherQueryRunner";
import { setConnected, setConnectionModalOpen, setConnectionProperties, setDesktopConnectionProperties, resetShareDetails, setShareDetailsFromUrl } from "./ApplicationActions";


export const createConnectionThunk = (protocol, url, port, database, username, password) => (dispatch: any, getState: any) => {
    try {
        const driver = createDriver(protocol, url, port, username, password)
        console.log("Attempting to connect...")
        const validateConnection = (records) => {
            console.log("Confirming connection was established...")
            if (records && records[0] && records[0]["error"]) {
                dispatch(createNotificationThunk("Unable to establish connection", records[0]["error"]));
            } else if (records && records[0] && records[0].keys[0] == "connected") {

                dispatch(setConnectionProperties(protocol, url, port, database, username, password));
                dispatch(setConnectionModalOpen(false));
                dispatch(setConnected(true));
            } else {
                dispatch(createNotificationThunk("Unknown Connection Error", "Check the browser console."));
            }
        }
        runCypherQuery(driver, database, "RETURN true as connected", {}, {}, ["connected"], 1, () => { return }, (records) => validateConnection(records))
    } catch (e) {
        dispatch(createNotificationThunk("Unable to establish connection", e));
    }
}

export const createConnectionFromDesktopIntegrationThunk = () => (dispatch: any, getState: any) => {
    try {
        const desktopConnectionDetails = getState().application.desktopConnection;
        const protocol = desktopConnectionDetails.protocol;
        const url = desktopConnectionDetails.url;
        const port = desktopConnectionDetails.port;
        const database = desktopConnectionDetails.database;
        const username = desktopConnectionDetails.username;
        const password = desktopConnectionDetails.password;
        dispatch(createConnectionThunk(protocol, url, port, database, username, password));
    } catch (e) {
        dispatch(createNotificationThunk("Unable to establish connection to Neo4j Desktop", e));
    }
}

export const setDatabaseFromNeo4jDesktopIntegrationThunk = () => (dispatch: any, getState: any) => {
    const getActiveDatabase = (context) => {
        for (let pi = 0; pi < context.projects.length; pi++) {
            let prj = context.projects[pi];
            for (let gi = 0; gi < prj.graphs.length; gi++) {
                let grf = prj.graphs[gi];
                if (grf.status == 'ACTIVE') {
                    return grf;
                }
            }
        }
        // No active database found - ask for manual connection details.
        return null;
    }

    let promise = window.neo4jDesktopApi && window.neo4jDesktopApi.getContext();

    if (promise) {
        promise.then(function (context) {
            let neo4j = getActiveDatabase(context);
            if (neo4j) {
                dispatch(setDesktopConnectionProperties(
                    neo4j.connection.configuration.protocols.bolt.url.split("://")[0],
                    neo4j.connection.configuration.protocols.bolt.url.split("://")[1].split(":")[0],
                    neo4j.connection.configuration.protocols.bolt.port,
                    undefined,
                    neo4j.connection.configuration.protocols.bolt.username,
                    neo4j.connection.configuration.protocols.bolt.password));
            }
        });
    }
}

export const handleSharedDashboardsThunk = () => (dispatch: any, getState: any) => {
    try {
        dispatch(resetShareDetails());
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.get("share") !== null) {
            const id = decodeURIComponent(urlParams.get("id"));
            const type = urlParams.get("type");
            const standalone = urlParams.get("standalone") == "yes";
            if(urlParams.get("credentials")){
                const connection = decodeURIComponent(urlParams.get("credentials"));
                const protocol = connection.split("://")[0];
                const username = connection.split("://")[1].split(":")[0];
                const password = connection.split("://")[1].split(":")[1].split("@")[0];
                const database = connection.split("@")[1].split(":")[0];
                const url = connection.split("@")[1].split(":")[1];
                const port = connection.split("@")[1].split(":")[2];
                dispatch(setShareDetailsFromUrl(type, id, standalone, protocol, url, port, database, username, password));
            }else{
                dispatch(setShareDetailsFromUrl(type, id, undefined, undefined, undefined, undefined, undefined, undefined, undefined));
            }
          
        }

    } catch (e) {
        dispatch(createNotificationThunk("Unable to load shared dashboard", "You have specified an invalid/incomplete share URL. Try regenerating the URL from the sharing window."));
    }
}