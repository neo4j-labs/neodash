import { SelectorProps } from './SelectorProps';

/**
 * Interface for all parameter selector components to implement.
 */
export interface QuerySelectorProps extends SelectorProps {
  query: string | undefined;
  /**
   * Callback to query the database with a given set of parameters. Calls 'setRecords' upon completion.
   */
  queryCallback: (query: string | undefined, parameters: Record<string, any>, setRecords: any) => void;
  /**
   * A dictionary of all global dashboard parameters.
   */
  allParameters: Record<string, any> | undefined;
  /**
   * Create the parameter selector in compatibility mode for NeoDash 2.2.1 or earlier.
   */
  compatibilityMode: boolean;
}
