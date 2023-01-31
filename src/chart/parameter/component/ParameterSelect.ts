import { Record as Neo4jRecord } from 'neo4j-driver';

// Interface for all parameter selector components.
export interface ParameterSelectProps {
  parameterName: string;
  parameterValue: string | number;
  setParameterValue: (value) => void;
  query: string;
  queryCallback: (query: string, parameters: Record<string, any>, records: Neo4jRecord[]) => void;
  settings: Record<string, any> | undefined;
  allParameters: Record<string, any> | undefined;
}
