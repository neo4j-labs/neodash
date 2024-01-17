export const LOGGING_PREFIX = 'APPLICATION/LOGGING/';

export const SET_LOGGING_MODE = `${LOGGING_PREFIX}/SET_LOGGING_MODE`;
export const setLoggingMode = (loggingMode: string) => ({
  type: SET_LOGGING_MODE,
  payload: { loggingMode },
});

export const SET_LOGGING_DATABASE = `${LOGGING_PREFIX}/SET_LOGGING_DATABASE`;
export const setLoggingDatabase = (loggingDatabase: string) => ({
  type: SET_LOGGING_DATABASE,
  payload: { loggingDatabase },
});

export const SET_LOG_ERROR_NOTIFICATION = `${LOGGING_PREFIX}/SET_LOG_ERROR_NOTIFICATION`;
export const setLogErrorNotification = (logErrorNotification: any) => ({
  type: SET_LOG_ERROR_NOTIFICATION,
  payload: { logErrorNotification },
});
