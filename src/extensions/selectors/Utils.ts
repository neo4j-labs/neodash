import { Date as Neo4jDate } from 'neo4j-driver-core/lib/temporal-types.js';

/**
 * Checks that the value in input can be casted to Neo4j Bolt Driver Date
 * @param value
 * @returns True if it's an object castable to date
 */
export function isCastableToNeo4jDate(value: object) {
  let keys = Object.keys(value);
  return keys.length == 3 && keys.includes('day') && keys.includes('month') && keys.includes('year');
}

/**
 * Casts value in input to Neo4j Date bolt driver. If can't cast, it will throw an error
 * @param value
 * @returns Casted value to Neo4j Bolt Driver Date
 */
export function castToNeo4jDate(value: object) {
  if (isCastableToNeo4jDate(value)) {
    // @ts-ignore
    return new Neo4jDate(value.year, value.month, value.day);
  }
  throw new Error(`Invalid input for castToNeo4jDate: ${value}`);
}

/**
 * Wrapper for empty check logic, to prevent calling writing the same code too many times
 * @param obj
 * @returns  Returns True if the input is null, undefined or an empty object
 */
export const isEmptyObject = (obj: object) => {
  if (obj == undefined) {
    return true;
  }
  return Object.keys(obj).length == 0;
};

// returns a new object with the values at each key mapped using mapFn(value)
export const objectMap = (object, mapFn) => {
  return Object.keys(object).reduce((result, key) => {
    result[key] = mapFn(object[key]);
    return result;
  }, {});
};

export const update = (state, mutations) => Object.assign({}, state, mutations);
