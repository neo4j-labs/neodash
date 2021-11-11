
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
export const setConnectionProperties = (protocol: string, url: string, port: string,
    database: string, username: string, password: string) => ({
        type: SET_CONNECTION_PROPERTIES,
        payload: { protocol, url, port, database, username, password },
    });