export const QueryStorageKey = 'neoDashPreAuthQueryString';

// https://stackoverflow.com/questions/8648892/how-to-convert-url-parameters-to-a-javascript-object
export const getUrlQueryParamObject = (queryString) => {
  const urlParams = new URLSearchParams(queryString);
  const entries = urlParams.entries(); // returns an iterator of decoded [key,value] tuples
  const result = {};
  for (const [key, value] of entries) {
    // each 'entry' is a [key, value] tupple
    result[key] = value;
  }
  return result;
};

export const handleSavedQueryString = (queryString) => {
  // console.log('handleNeoDashLaunch after silentAuth')
  if (!queryString) {
    // console.log('handleNeoDashLaunch localStorage - getting query string')
    queryString = localStorage.getItem(QueryStorageKey) || '';
    if (queryString) {
      // console.log('handleNeoDashLaunch query string from local storage is', queryString)
      const queryObject = getUrlQueryParamObject(queryString);
      window.history.pushState(queryObject, document.title, new URL(queryString, window.location.href));
    }
  }
  localStorage.removeItem(QueryStorageKey);
  return queryString;
};

export const saveQueryString = (queryString) => {
  if (queryString) {
    // console.log('handleNeoDashLaunch localStorage - storing query string')
    localStorage.setItem(QueryStorageKey, queryString);
  }
};
