import { Record as Neo4jRecord } from 'neo4j-driver';

// Interface for all charts that NeoDash can render.
// When you extend NeoDash, make sure that your component implements this interface.
export interface ChartProps {
  records: Neo4jRecord[]; // Query output, Neo4j records as returned from the driver.
  extensions?: Record<string, any>; // A dictionary of enabled extensions.
  selection?: Record<string, any>; // A dictionary with the selection made in the report footer.
  settings?: Record<string, any>; // A dictionary with the 'advanced settings' specified through the NeoDash interface.
  dimensions?: Record<string, number>; // a dictionary with the dimensions of the report (likely not needed, charts automatically fill up space).
  fullscreen?: boolean; // flag indicating whether the report is rendered in a fullscreen view.
  parameters?: Record<string, any>; // A dictionary with the global dashboard parameters.
  queryCallback?: (query: string, parameters: Record<string, any>, records: Neo4jRecord[]) => null; // Optionally, a way for the report to read more data from Neo4j.
  setGlobalParameter?: (name: string, value: string) => void; // Allows a chart to update a global dashboard parameter to be used in Cypher queries for other reports.
  getGlobalParameter?: (name) => string; // Allows a chart to get a global dashboard parameter.
}
