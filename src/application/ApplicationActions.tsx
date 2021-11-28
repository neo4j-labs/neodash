
export const CLEAR_NOTIFICATION = 'APPLICATION/CLEAR_NOTIFICATION';
export const clearNotification = () => ({
    type: CLEAR_NOTIFICATION,
    payload: {},
});

export const CREATE_NOTIFICATION = 'APPLICATION/CREATE_NOTIFICATION';
export const createNotification = (title: any, message: any) => ({
    type: CREATE_NOTIFICATION,
    payload: { title, message },
});

export const SET_CONNECTED = 'APPLICATION/SET_CONNECTED';
export const setConnected = (connected: boolean) => ({
    type: SET_CONNECTED,
    payload: { connected },
});

export const SET_CONNECTION_MODAL_OPEN = 'APPLICATION/SET_CONNECTION_MODAL_OPEN';
export const setConnectionModalOpen = (open: boolean) => ({
    type: SET_CONNECTION_MODAL_OPEN,
    payload: { open },
});


export const SET_ABOUT_MODAL_OPEN = 'APPLICATION/SET_ABOUT_MODAL_OPEN';
export const setAboutModalOpen = (open: boolean) => ({
    type: SET_ABOUT_MODAL_OPEN,
    payload: { open },
});

export const SET_CONNECTION_PROPERTIES = 'APPLICATION/SET_CONNECTION_PROPERTIES';
export const setConnectionProperties = (protocol: string, url: string, port: string, database: string, username: string, password: string) => ({
    type: SET_CONNECTION_PROPERTIES,
    payload: { protocol, url, port, database, username, password },
});

export const SET_DESKTOP_CONNECTION_PROPERTIES = 'APPLICATION/SET_DESKTOP_CONNECTION_PROPERTIES';
export const setDesktopConnectionProperties = (protocol: string, url: string, port: string, database: string, username: string, password: string) => ({
    type: SET_DESKTOP_CONNECTION_PROPERTIES,
    payload: { protocol, url, port, database, username, password },
});

export const CLEAR_DESKTOP_CONNECTION_PROPERTIES = 'APPLICATION/CLEAR_DESKTOP_CONNECTION_PROPERTIES';
export const clearDesktopConnectionProperties = () => ({
    type: CLEAR_DESKTOP_CONNECTION_PROPERTIES,
    payload: {},
});

// Legacy pre1-v2 dashboard that can be optionally upgraded.
export const SET_OLD_DASHBOARD = 'APPLICATION/SET_OLD_DASHBOARD';
export const setOldDashboard = (text: string) => ({
    type: SET_OLD_DASHBOARD,
    payload: { text },
});

// Legacy pre1-v2 dashboard that can be optionally upgraded.
export const RESET_SHARE_DETAILS = 'APPLICATION/RESET_SHARE_DETAILS';
export const resetShareDetails = () => ({
    type: RESET_SHARE_DETAILS,
    payload: { },
});

export const SET_SHARE_DETAILS_FROM_URL = 'APPLICATION/SET_SHARE_DETAILS_FROM_URL';
export const setShareDetailsFromUrl = (type: string, id: string, standalone: boolean, protocol: string, url: string, port: string, database: string, username: string, password: string) => ({
    type: SET_SHARE_DETAILS_FROM_URL,
    payload: { type, id, standalone, protocol, url, port, database, username, password },
});