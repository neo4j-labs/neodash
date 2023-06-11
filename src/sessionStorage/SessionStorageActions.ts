export const SESSION_STORAGE_PREFIX = 'NEODASH_SESSION_STORAGE';

export const RESET_STATE = `${SESSION_STORAGE_PREFIX}/RESET_STATE`;
export const resetSessionStorage = () => ({
  type: RESET_STATE,
  payload: {},
});

export const STORE_VALUE_SESSION_STORAGE = `${SESSION_STORAGE_PREFIX}/STORE_VALUE`;
/**
 *  Sets a value with the key passed in input
 * @param key Key to use to access the SessionStorage
 * @param value Value to add inside the SessionStorage
 */
export const setSessionStorageValue = (key, value) => ({
  type: STORE_VALUE_SESSION_STORAGE,
  payload: { key, value },
});

/**
 * Deletes a key from the SessionStorage
 * @param key Key to use to access the SessionStorage
 */
export const DELETE_VALUE_SESSION_STORAGE = `${SESSION_STORAGE_PREFIX}/DELETE_VALUE`;
export const deleteSessionStorageValue = (key) => ({
  type: DELETE_VALUE_SESSION_STORAGE,
  payload: { key },
});

/**
 * Deletes all the keys that start with the prefix passed in input
 * @param prefix Prefix used to match the keys inside the SessionStorage
 */
export const DELETE_ALL_KEYS_WITH_PREFIX_SESSION_STORAGE = `${SESSION_STORAGE_PREFIX}/DELETE_ALL_KEYS_WITH_PREFIX`;
export const deleteAllKeysInSessionStorageWithPrefix = (prefix) => ({
  type: DELETE_ALL_KEYS_WITH_PREFIX_SESSION_STORAGE,
  payload: { prefix },
});
