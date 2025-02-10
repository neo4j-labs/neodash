/**
 * Extracts all parameter names from a given Cypher query string.
 *
 * @param {string} cypherQuery The Cypher query string to extract parameter names from.
 * @returns {string[]} An array containing all extracted parameter names.
 */
export const extractAllParameterNames = (cypherQuery: string): string[] => {
  // A regular expression pattern to match parameter names following '$'
  const pattern = /\$([A-Za-z_]\w*)/g;

  const parameterNames: string[] = [];
  let match: any;

  while ((match = pattern.exec(cypherQuery)) !== null) {
    parameterNames.push(match[1]);
  }

  return parameterNames;
};

/**
 * Checks if all parameter names are present in the global parameter names.
 *
 * @param {string[]} parameterNames An array of parameter names to be checked.
 * @param {object} globalParameterNames The object containing global parameter names to compare against.
 * @returns {boolean} A boolean indicating whether all parameters are present in the global parameters.
 */
export const checkParametersNameInGlobalParameter = (parameterNames: string[], globalParameterNames: any): boolean => {
  for (const key of parameterNames) {
    if (
      !globalParameterNames[key] ||
      (Array.isArray(globalParameterNames[key]) && globalParameterNames[key].length === 0) ||
      globalParameterNames[key] === ''
    ) {
      return true;
    }
  }
  return false;
};
