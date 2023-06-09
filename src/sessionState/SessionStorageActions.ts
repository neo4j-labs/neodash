export const SESSION_STORAGE_PREFIX = 'NEODASH_SESSION_STORAGE';

export const RESET_STATE = `${SESSION_STORAGE_PREFIX}/RESET_STATE`;
export const resetSessionStorage = () => ({
  type: RESET_STATE,
  payload: {},
});

export const STORE_VALUE_SESSION_STORAGE = `${SESSION_STORAGE_PREFIX}/STORE_VALUE`;
export const setSessionStorageValue = (key, value) => ({
  type: STORE_VALUE_SESSION_STORAGE,
  payload: { key, value },
});

export const DELETE_VALUE_SESSION_STORAGE = `${SESSION_STORAGE_PREFIX}/DELETE_VALUE`;
export const deleteSessionStorageValue = (key) => ({
  type: DELETE_VALUE_SESSION_STORAGE,
  payload: { key },
});

export const DELETE_ALL_KEYS_WITH_PREFIX_SESSION_STORAGE = `${SESSION_STORAGE_PREFIX}/DELETE_ALL_KEYS_WITH_PREFIX`;
export const deleteAllKeysInSessionStorageWithPrefix = (prefix) => ({
  type: DELETE_ALL_KEYS_WITH_PREFIX_SESSION_STORAGE,
  payload: { prefix },
});
