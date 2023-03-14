import { Record as Neo4jRecord } from 'neo4j-driver';

// TODO: define interface for future drawers
// TODO: This is a "duplicate" of the chart props, they share a lot of common entities. Should be abstracted to common type.
export interface DrawerProps {
  records: Neo4jRecord[]; // Query output, Neo4j records as returned from the driver.
  extensions?: Record<string, any>; // A dictionary of enabled extensions.
  selection?: Record<string, any>; // A dictionary with the selection made in the report footer.
  settings?: Record<string, any>; // A dictionary with the 'advanced settings' specified through the NeoDash interface.
  dimensions?: Record<string, number>; // a dictionary with the dimensions of the report (likely not needed, charts automatically fill up space).
  fullscreen?: boolean; // flag indicating whether the report is rendered in a fullscreen view.
  parameters?: Record<string, any>; // A dictionary with the global dashboard parameters.
  queryCallback: (query: string | undefined, parameters: Record<string, any>, setRecords: any) => void; // Callback to query the database with a given set of parameters. Calls 'setReccords' upon completion.
  setGlobalParameter?: (name: string, value: string) => void; // Allows a chart to update a global dashboard parameter to be used in Cypher queries for other reports.
  getGlobalParameter?: (name) => string; // Allows a chart to get a global dashboard parameter.
  updateReportSetting?: (name, value) => void; // Callback to update a setting for this report.
}
