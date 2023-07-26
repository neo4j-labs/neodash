/**
 * Interface for all parameter selector components to implement.
 */
export interface ParameterSelectProps {
  /**
   * Name of the parameter (e.g. neodash_person_name)
   */
  parameterName: string;
  /**
   * Display name of the parameter (e.g. neodash_person_name_display) - used by the NeoDash engine exclusively.
   */
  parameterDisplayName: string;
  /**
   * Parameter value as defined in the global state. (e.g. "Alfredo" or 1234)
   */
  parameterValue: string | number | null;
  /**
   * The parameter value ***displayed*** in the selector when selecting the actual parameterValue.
   */
  parameterDisplayValue: string | number;
  /**
   * Callback to update the value in the global state.
   */
  setParameterValue: (value) => void;
  /**
   * Callback to update the display value in the global state.
   */
  setParameterDisplayValue: (value) => void;
  /**
   * The query that can be used to retrieve parameter value suggestions from the database.
   */
  query: string | undefined;
  /**
   * Callback to query the database with a given set of parameters. Calls 'setRecords' upon completion.
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
  /**
   * Create the parameter selector in compatibility mode for NeoDash 2.2.1 or earlier.
   */
  compatibilityMode: boolean;
  /**
   * Add the possibility for multiple selections
   */
  multiSelector?: boolean;
}
