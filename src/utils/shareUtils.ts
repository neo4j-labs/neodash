const buildURL = (baseUrlWithPath: string, queryParams: string): URL => {
  const shareableURL = new URL(baseUrlWithPath);
  shareableURL.search = queryParams;
  return shareableURL;
};

const extractQueryParams = (pages, pageNumber = 0, parameters, exportPageParameters: boolean): string => {
  if (!parameters) {
    return '';
  }
  const map = new Map(Object.entries(parameters));
  return encodeIntoURIParams(map, pageNumber, pages, exportPageParameters);
};

const getPath = (currentUrl: string): string => {
  const parsedURL = new URL(currentUrl, window.location.origin);
  return parsedURL.origin + parsedURL.pathname;
};

const filterParams = (key: string, val: string): boolean => {
  return key.startsWith('neodash_') && !key.endsWith('_display') && val != null;
};

const extractParametersFromReports = (reports: any[]): Set<string> => {
  const paramSet = new Set<string>();

  for (const report of reports) {
    const { settings } = report;
    if (!settings) {
      continue;
    }
    if (settings.parameterName) {
      paramSet.add(settings.parameterName);
    }

    if (Array.isArray(settings.formFields)) {
      settings.formFields.forEach((formField) => {
        if (formField && formField?.settings?.parameterName != null && formField?.settings?.parameterName.length > 0) {
          paramSet.add(formField?.settings?.parameterName);
        }
      });
    }
  }
  return paramSet;
};

const filterMapByReports = (inputMap: Map<string, string>, paramSet: Set<string> | null): Map<string, string> => {
  if (paramSet == null) {
    return new Map();
  }
  const filteredMap = new Map<string, string>();

  for (const [key, val] of inputMap) {
    if (paramSet.has(key)) {
      filteredMap.set(key, handleArrayOfValues(val));
    }
  }

  return filteredMap;
};

const encodeIntoURIParams = (
  map: Map<string, any>,
  pageNumber: number,
  pages: any,
  exportPageParameters: boolean
): string => {
  const filteredParams: Map<string, string> = new Map([...map].filter(([key, val]) => filterParams(key, String(val))));

  const paramSet = exportPageParameters ? extractParametersFromReports(pages[pageNumber]?.reports) : null;
  const filteredMap = exportPageParameters ? filterMapByReports(filteredParams, paramSet) : filteredParams;
  const urlParams = new URLSearchParams();

  [...filteredMap.entries()].map(([key, val]) => {
    urlParams.set(key, val);
  });

  urlParams.set('page', String(pageNumber));

  return urlParams.toString();
};

const handleArrayOfValues = (val: string): string => {
  let res = '';
  if (Array.isArray(val)) {
    val.length >= 1 ? val.forEach((v) => (res = res.concat(`${v},`))) : (res = res.concat(','));
  } else {
    res = val;
  }
  return res;
};

export { buildURL, extractQueryParams, getPath };
