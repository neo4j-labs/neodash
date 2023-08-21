import { SelectorProps } from '../SelectorProps';

/**
 * Interface for all parameter selector components to implement.
 */
export interface DatePickerProps extends SelectorProps {
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
}
