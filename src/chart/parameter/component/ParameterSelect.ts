/**
 * Interface for all parameter selector components to implement.
 */
export interface ParameterSelectProps {
  /**
   * Name of the parameter (e.g. neodash_person_name)
   */
  parameterName: string;
  /**
   * Parameter value as defined in the global state. (e.g. "Alfredo" or 1234)
   */
  parameterValue: string | number;
  /**
   * Callback to update the value in the global state.
   */
  setParameterValue: (value) => void;
  /**
   * The query that can be used to retrieve parameter value suggestions from the database.
   */
  query: string | undefined;
  /**
   * Callback to query the database with a given set of parameters. Calls 'setReccords' upon completion.
   */
  queryCallback: (query: string | undefined, parameters: Record<string, any>, setRecords: any) => void;
  /**
   * The advanced settings for the parameter selector component.
   */
  settings: Record<string, any> | undefined;
  /**
   * A dictionary of all global dashboard parameters.
   */
  allParameters: Record<string, any> | undefined;
}
