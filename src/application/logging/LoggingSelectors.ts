
export const applicationGetLoggingSettings = (state: any) => {
  return {
    loggingMode: state.application.loggingMode,
    loggingDatabase: state.application.loggingDatabase,
    logErrorNotification: state.application.logErrorNotification,
  };
};
