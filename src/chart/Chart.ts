import { Record as Neo4jRecord } from 'neo4j-driver';

/**
 * Interface for all charts that NeoDash can render.
 * When you extend NeoDash, make sure that your component implements this interface.
 */
export interface ChartProps {
  records: Neo4jRecord[]; // Query output, Neo4j records as returned from the driver.
  extensions?: Record<string, any>; // A dictionary of enabled extensions.
  selection?: Record<string, any>; // A dictionary with the selection made in the report footer.
  settings?: Record<string, any>; // A dictionary with the 'advanced settings' specified through the NeoDash interface.
  dimensions?: Record<string, number>; // a dictionary with the dimensions of the report (likely not needed, charts automatically fill up space).
  fullscreen?: boolean; // flag indicating whether the report is rendered in a fullscreen view.
  parameters?: Record<string, any>; // A dictionary with the global dashboard parameters.
  queryCallback?: (query: string | undefined, parameters: Record<string, any>, setRecords: any) => void; // Callback to query the database with a given set of parameters. Calls 'setReccords' upon completion.
  createNotification?: (title: string, message: string) => void; // Callback to create a notification that overlays the entire application.
  setGlobalParameter?: (name: string, value: string) => void; // Allows a chart to update a global dashboard parameter to be used in Cypher queries for other reports.
  getGlobalParameter?: (name) => string; // Allows a chart to get a global dashboard parameter.
  updateReportSetting?: (name, value) => void; // Callback to update a setting for this report.
  fields: (fields) => string[]; // List of fields (return values) available for the report.
  setFields?: (fields) => void; // Update the list of fields for this report.
}

/**
 * A simplified schema of the Neo4j database.
 */
export interface Neo4jSchema {
  nodeLabels: string[]; // list of node labels.
  relationshipTypes: string[]; // list of relationship types.
  setPageNumber?: (index: number) => void; // Callback to update the currently selected page of the dashboard.
}
