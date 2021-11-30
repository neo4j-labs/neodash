/**
 * Reducers define changes to the application state when a given action
 */

import {
    CLEAR_DESKTOP_CONNECTION_PROPERTIES, CLEAR_NOTIFICATION, CREATE_NOTIFICATION, RESET_SHARE_DETAILS, SET_ABOUT_MODAL_OPEN, SET_CONNECTED,
    SET_CONNECTION_MODAL_OPEN, SET_CONNECTION_PROPERTIES, SET_DASHBOARD_TO_LOAD_AFTER_CONNECTING, SET_DESKTOP_CONNECTION_PROPERTIES, SET_OLD_DASHBOARD, SET_SHARE_DETAILS_FROM_URL, SET_STANDALONE_MODE, SET_WELCOME_SCREEN_OPEN
} from "./ApplicationActions";

const update = (state, mutations) =>
    Object.assign({}, state, mutations)

const initialState =
{
    notificationTitle: null,
    notificationMessage: null,
    connectionModalOpen: false,
    welcomeScreenOpen: true,
    aboutModalOpen: false,
    connection: {
        protocol: "neo4j",
        url: "localhost",
        port: "7687",
        database: "",
        username: "neo4j",
        password: ""
    },
    shareDetails: undefined,
    desktopConnection: null,
    connected: false,
    dashboardToLoadAfterConnecting: null,
    standalone: false
}
export const applicationReducer = (state = initialState, action: { type: any; payload: any; }) => {
    const { type, payload } = action;

    if (!action.type.startsWith('APPLICATION/')) {
        return state;
    }

    // Application state updates are handled here.
    switch (type) {
        case CREATE_NOTIFICATION: {
            const { title, message } = payload;
            state = update(state, { notificationTitle: title, notificationMessage: message })
            return state;
        }
        case CLEAR_NOTIFICATION: {
            state = update(state, { notificationTitle: null, notificationMessage: null })
            return state;
        }
        case SET_CONNECTED: {
            const { connected } = payload;
            state = update(state, { connected: connected })
            return state;
        }
        case SET_CONNECTION_MODAL_OPEN: {
            const { open } = payload;
            state = update(state, { connectionModalOpen: open })
            return state;
        }
        case SET_ABOUT_MODAL_OPEN: {
            const { open } = payload;
            state = update(state, { aboutModalOpen: open })
            return state;
        }
        case SET_WELCOME_SCREEN_OPEN: {
            const { open } = payload;
            state = update(state, { welcomeScreenOpen: open })
            return state;
        }
        case SET_STANDALONE_MODE: {
            const { standalone } = payload;
            state = update(state, { standalone: standalone })
            return state;
        }
        case SET_OLD_DASHBOARD: {
            const { text } = payload;
            state = update(state, { oldDashboard: text })
            return state;
        }
        case SET_DASHBOARD_TO_LOAD_AFTER_CONNECTING: {
            const { id } = payload;
            state = update(state, { dashboardToLoadAfterConnecting: id })
            return state;
        }
        case SET_CONNECTION_PROPERTIES: {
            const { protocol, url, port, database, username, password } = payload;
            state = update(state, {
                connection: {
                    protocol: protocol, url: url, port: port,
                    database: database, username: username, password: password
                }
            })
            return state;
        }
        case CLEAR_DESKTOP_CONNECTION_PROPERTIES: {
            state = update(state, { desktopConnection: null })
            return state;
        }
        case SET_DESKTOP_CONNECTION_PROPERTIES: {
            const { protocol, url, port, database, username, password } = payload;
            state = update(state, {
                desktopConnection: {
                    protocol: protocol, url: url, port: port,
                    database: database, username: username, password: password
                }
            })
            return state;
        }
        case RESET_SHARE_DETAILS: {
            state = update(state, { shareDetails: undefined });
            return state;
        }
        case SET_SHARE_DETAILS_FROM_URL: {
            const { type, id, standalone, protocol, url, port, database, username, password } = payload;
            state = update(state, {
                shareDetails: {
                    type: type,
                    id: id,
                    standalone: standalone,
                    protocol: protocol,
                    url: url,
                    port: port,
                    database: database,
                    username: username,
                    password: password
                }
            })
            return state;
        }
        default: {
            return state;
        }
    }
}