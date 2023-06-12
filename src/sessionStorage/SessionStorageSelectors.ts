const getSessionStorage = (state: any) => state.sessionStorage;

export const getSessionStorageValue = (state: any, key: any) => {
  const sessionStorage = getSessionStorage(state);
  return sessionStorage[key] ? sessionStorage[key] : undefined;
};
