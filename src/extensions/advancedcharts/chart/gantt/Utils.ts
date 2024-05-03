import { toNumber } from '../../../../chart/ChartUtils';
import { buildGraphVisualizationObjectFromRecords } from '../../../../chart/graph/util/RecordUtils';
import date_utils from './frappe/lib/date_utils';

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

// Helper function to extract a dependency map from the parsed relationships.
export function createDependenciesMap(links) {
  const dependencies = {};
  links.forEach((l) => {
    if (!dependencies[`${l.target}`]) {
      dependencies[`${l.target}`] = [];
    }
    dependencies[`${l.target}`].push(`${l.source}`);
  });
  return dependencies;
}

// Helper function to extract a dependency map from the parsed relationships.
export function createDependenciesDirectionsMap(links, direction_property) {
  const directions = {};
  links.forEach((l) => {
    if (!directions[`${l.target}`]) {
      directions[`${l.target}`] = [];
    }
    directions[`${l.target}`].push(`${l.properties[direction_property]}`);
  });
  return directions;
}

// Helper function to extract a list of task objects from the parsed nodes.
export function createTasksList(
  nodes,
  dependencies,
  dependencyDirections,
  startDateProperty,
  endDateProperty,
  nameProperty
) {
  return nodes
    .map((n) => {
      let neoStartDate = n.properties[startDateProperty];
      let neoEndDate = n.properties[endDateProperty];
      const name = n.properties[nameProperty];

      // Two cases:
      // 1. The date returned is a valid neo4j date object. We do nothing.
      // 2. The date returned is not a valid Neo4j date but a string representing one. We try to parse it as one, and set the date accordingly.
      // Fallback - we skip the current entry altogether.
      if (
        !neoStartDate?.year ||
        !neoStartDate?.month ||
        !neoStartDate?.day ||
        !neoEndDate?.year ||
        !neoEndDate?.month ||
        !neoEndDate?.day
      ) {
        // Not a valid Neo4j date, try to parse it as one...
        const parsedStartDate = date_utils.parse(neoStartDate);
        if (parsedStartDate) {
          neoStartDate = {};
          neoStartDate.year = parsedStartDate.getFullYear();
          neoStartDate.month = parsedStartDate.getMonth();
          neoStartDate.day = parsedStartDate.getDay();
        }
        const parsedEndDate = date_utils.parse(neoEndDate);
        if (parsedEndDate) {
          neoEndDate = {};
          neoEndDate.year = parsedEndDate.getFullYear();
          neoEndDate.month = parsedEndDate.getMonth();
          neoEndDate.day = parsedEndDate.getDay();
        }
        if (!parsedEndDate) {
          // Fallback scenario, parsing has failed
          return undefined;
        }
      }
      let res = {
        start: new Date(toNumber(neoStartDate.year), toNumber(neoStartDate.month), toNumber(neoStartDate.day)),
        end: new Date(toNumber(neoEndDate.year), toNumber(neoEndDate.month), toNumber(neoEndDate.day)),
        name: name || '(undefined)',
        labels: n.labels,
        dependencies: dependencies[n.id],
        dependencyDirections: dependencyDirections[n.id],
        id: `${n.id}`,
        properties: n.properties,
        type: 'task',
        color: n.color,
        progress: 100,
        isDisabled: true,
        styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
      };
      return res;
    })
    .filter((i) => i !== undefined);
}
