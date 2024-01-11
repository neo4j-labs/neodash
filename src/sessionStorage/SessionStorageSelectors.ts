export const getSessionStorage = (state: any) => state.sessionStorage;

export const getSessionStorageValue = (state: any, key: any) => {
  const sessionStorage = getSessionStorage(state);
  return sessionStorage[key] ? sessionStorage[key] : undefined;
};

export const getSessionStorageValuesWithPrefix = (state: any, prefix: any) => {
  const sessionStorage = getSessionStorage(state);
  let filtered = Object.fromEntries(Object.entries(sessionStorage).filter(([k, _]) => k.startsWith(prefix)));
  return filtered;
};
