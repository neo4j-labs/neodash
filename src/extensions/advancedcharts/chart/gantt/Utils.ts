import { buildGraphVisualizationObjectFromRecords } from '../../../../chart/graph/util/RecordUtils';

// Helper function to extract Neo4j types (nodes and relationships) from a records object.
export const generateVisualizationDataGraph = (records, nodeLabels, linkTypes, colorScheme, fields, settings) => {
  let nodes: Record<string, any>[] = [];
  let links: Record<string, any>[] = [];
  const extractedGraphFromRecords = buildGraphVisualizationObjectFromRecords(
    records,
    nodes,
    links,
    nodeLabels,
    linkTypes,
    colorScheme,
    fields,
    settings.nodeColorProp,
    settings.defaultNodeColor,
    settings.nodeSizeProp,
    settings.defaultNodeSize,
    settings.relWidthProp,
    settings.defaultRelWidth,
    settings.relColorProp,
    settings.defaultRelColor,
    settings.styleRules
  );
  return extractedGraphFromRecords;
};
