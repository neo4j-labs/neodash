import merge from 'lodash.merge';

export const update = (state, mutations) => Object.assign({}, state, mutations);
export const objMerge = (a, b) => merge({}, a, b);

// returns a new object with the values at each key mapped using mapFn(value)
export const objectMap = (object, mapFn) => {
  return Object.keys(object).reduce((result, key) => {
    result[key] = mapFn(object[key]);
    return result;
  }, {});
};
