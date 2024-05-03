import { LOGGING_PREFIX, SET_LOGGING_DATABASE, SET_LOGGING_MODE, SET_LOG_ERROR_NOTIFICATION } from './LoggingActions';

const update = (state, mutations) => Object.assign({}, state, mutations);

export const LOGGING_INITIAL_STATE = {
  loggingMode: '0',
  logErrorNotification: '3',
  loggingDatabase: undefined,
};

export const loggingReducer = (state = LOGGING_INITIAL_STATE, action: { type: any; payload: any }) => {
  const { type, payload } = action;

  if (!action.type.startsWith(LOGGING_PREFIX)) {
    return state;
  }

  // Logging state updates are handled here.
  switch (type) {
    case SET_LOGGING_MODE: {
      const { loggingMode } = payload;
      state = update(state, { loggingMode: loggingMode });
      return state;
    }
    case SET_LOGGING_DATABASE: {
      const { loggingDatabase } = payload;
      state = update(state, { loggingDatabase: loggingDatabase });
      return state;
    }
    case SET_LOG_ERROR_NOTIFICATION: {
      const { logErrorNotification } = payload;
      state = update(state, { logErrorNotification: logErrorNotification });
      return state;
    }
    default: {
      return state;
    }
  }
};
