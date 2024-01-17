import merge from 'lodash.merge';

/**
 * Merges two objects using lodash.merge and returns the result.
 * @param a - The first object to merge.
 * @param b - The second object to merge.
 * @returns A new object representing the merged result.
 */
export const objMerge = (a, b) => {
  return merge({}, a, b);
};

/**
 * Returns a new object with values at each key mapped using the provided map function.
 * @param object - The original object to map.
 * @param mapFn - The mapping function to apply to each value.
 * @returns A new object with mapped values.
 */
export const objectMap = (object, mapFn) => {
  return Object.keys(object).reduce((result, key) => {
    result[key] = mapFn(object[key]);
    return result;
  }, {});
};
