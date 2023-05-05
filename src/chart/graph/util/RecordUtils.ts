import { evaluateRulesOnNode } from '../../../extensions/styling/StyleRuleEvaluator';
import { extractNodePropertiesFromRecords, mergeNodePropsFieldsLists } from '../../../report/ReportRecordProcessing';
import { valueIsArray, valueIsNode, valueIsRelationship, valueIsPath } from '../../ChartUtils';
import { GraphChartVisualizationProps } from '../GraphChartVisualization';
import { assignCurvatureToLink } from './RelUtils';
import { isNode } from 'neo4j-driver-core/lib/graph-types.js';

const update = (state, mutations) => Object.assign({}, state, mutations);

// Gets all graphy entities (nodes/relationships) from the complete set of return values.
function extractGraphEntitiesFromField(
  value,
  nodes: Record<string, any>[],
  links: Record<string, any>[],
  nodeLabels: Record<string, any>,
  linkTypes: Record<string, any>,
  frozen: boolean,
  nodeSizeProperty: string,
  defaultNodeSize: number,
  relWidthProperty: string,
  defaultRelWidth: number,
  relColorProperty: string,
  defaultRelColor: string,
  nodePositions: Record<string, any>[]
) {
  if (value == undefined) {
    return;
  }
  if (valueIsArray(value)) {
    value.forEach((v) =>
      extractGraphEntitiesFromField(
        v,
        nodes,
        links,
        nodeLabels,
        linkTypes,
        frozen,
        nodeSizeProperty,
        defaultNodeSize,
        relWidthProperty,
        defaultRelWidth,
        relColorProperty,
        defaultRelColor,
        nodePositions
      )
    );
  } else if (valueIsNode(value)) {
    value.labels.forEach((l) => (nodeLabels[l] = true));
    nodes[value.identity.low] = {
      id: value.identity.low,
      labels: value.labels,
      size: value.properties[nodeSizeProperty] ? value.properties[nodeSizeProperty] : defaultNodeSize,
      properties: value.properties,
      mainLabel: value.labels[value.labels.length - 1],
    };
    if (frozen && nodePositions && nodePositions[value.identity.low]) {
      nodes[value.identity.low].fx = nodePositions[value.identity.low][0];
      nodes[value.identity.low].fy = nodePositions[value.identity.low][1];
    }
  } else if (valueIsRelationship(value)) {
    if (links[`${value.start.low},${value.end.low}`] == undefined) {
      links[`${value.start.low},${value.end.low}`] = [];
    }
    const addItem = (arr, item) => arr.find((x) => x.id === item.id) || arr.push(item);
    addItem(links[`${value.start.low},${value.end.low}`], {
      id: value.identity.low,
      source: value.start.low,
      target: value.end.low,
      type: value.type,
      width: value.properties[relWidthProperty] ? value.properties[relWidthProperty] : defaultRelWidth,
      color: value.properties[relColorProperty] ? value.properties[relColorProperty] : defaultRelColor,
      properties: value.properties,
    });
  } else if (valueIsPath(value)) {
    value.segments.map((segment) => {
      extractGraphEntitiesFromField(
        segment.start,
        nodes,
        links,
        nodeLabels,
        linkTypes,
        frozen,
        nodeSizeProperty,
        defaultNodeSize,
        relWidthProperty,
        defaultRelWidth,
        relColorProperty,
        defaultRelColor,
        nodePositions
      );
      extractGraphEntitiesFromField(
        segment.relationship,
        nodes,
        links,
        nodeLabels,
        linkTypes,
        frozen,
        nodeSizeProperty,
        defaultNodeSize,
        relWidthProperty,
        defaultRelWidth,
        relColorProperty,
        defaultRelColor,
        nodePositions
      );
      extractGraphEntitiesFromField(
        segment.end,
        nodes,
        links,
        nodeLabels,
        linkTypes,
        frozen,
        nodeSizeProperty,
        defaultNodeSize,
        relWidthProperty,
        defaultRelWidth,
        relColorProperty,
        defaultRelColor,
        nodePositions
      );
    });
  }
}

export function buildGraphVisualizationObjectFromRecords(
  records: any[], // Neo4jRecord[],
  nodes: Record<string, any>[],
  links: Record<string, any>[],
  nodeLabels: Record<string, any>,
  linkTypes: Record<string, any>,
  colorScheme: any,
  fields: any,
  nodeColorProperty: any,
  defaultNodeColor: any,
  nodeSizeProperty: any,
  defaultNodeSize: any,
  relWidthProperty: any,
  defaultRelWidth: any,
  relColorProperty: any,
  defaultRelColor: any,
  styleRules: any,
  nodePositions: any,
  frozen: any
) {
  // Extract graph objects from result set.
  records.forEach((record) => {
    record._fields.forEach((field) => {
      extractGraphEntitiesFromField(
        field,
        nodes,
        links,
        nodeLabels,
        linkTypes,
        frozen,
        nodeSizeProperty,
        defaultNodeSize,
        relWidthProperty,
        defaultRelWidth,
        relColorProperty,
        defaultRelColor,
        nodePositions
      );
    });
  });
  // Assign proper curvatures to relationships.
  // This is needed for pairs of nodes that have multiple relationships between them, or self-loops.
  const linksList = Object.values(links).map((linkArray) => {
    return linkArray.map((link, i) => {
      const mirroredNodePair = links[`${link.target},${link.source}`];
      return assignCurvatureToLink(link, i, linkArray.length, mirroredNodePair ? mirroredNodePair.length : 0);
    });
  });

  // Assign proper colors to nodes.
  const totalColors = colorScheme ? colorScheme.length : 0;
  const nodeLabelsList = fields.map((e) => e[0]);
  const nodesList = Object.values(nodes).map((node) => {
    // First try to assign a node a color if it has a property specifying the color.
    let assignedColor = node.properties[nodeColorProperty]
      ? node.properties[nodeColorProperty]
      : totalColors > 0
      ? colorScheme[nodeLabelsList.indexOf(node.mainLabel) % totalColors]
      : 'grey';
    // Next, evaluate the custom styling rules to see if there's a rule-based override
    assignedColor = evaluateRulesOnNode(node, 'node color', assignedColor, styleRules);
    return update(node, { color: assignedColor ? assignedColor : defaultNodeColor });
  });

  // Set the data dictionary that is read by the visualization.
  return {
    nodes: nodesList,
    links: linksList.flat(),
  };
}

/**
 * Utility function to inject new records into an existing visualization while it already exists.
 * This is used to enable graph interactivity (e.g. exploration, editing).
 * @param records a new set of Neo4j records.
 * @param props properties of the existing graph visualization.
 */
export function injectNewRecordsIntoGraphVisualization(
  records: any[], // Neo4jRecord[],
  props: GraphChartVisualizationProps
) {
  // We should probably just maintain these in the state...
  const nodesMap = {};
  props.data.nodes.forEach((node) => {
    nodesMap[node.id] = node;
  });
  const linksMap = {};
  props.data.links.forEach((link) => {
    linksMap[link.id] = link;
  });
  const newFields = extractNodePropertiesFromRecords(records);
  const mergedFields = mergeNodePropsFieldsLists(props.engine.fields, newFields);
  props.engine.setFields(mergedFields);

  const { nodes, links } = buildGraphVisualizationObjectFromRecords(
    records,
    { ...nodesMap },
    {},
    props.data.nodeLabels,
    props.data.linkTypes,
    props.style.colorScheme,
    mergedFields,
    props.style.nodeColorProp,
    props.style.defaultNodeColor,
    props.style.nodeSizeProp,
    props.style.defaultNodeSize,
    props.style.relWidthProp,
    props.style.defaultRelWidth,
    props.style.relColorProp,
    props.style.defaultRelColor,
    props.extensions.styleRules,
    props.interactivity.nodePositions,
    props.interactivity.layoutFrozen
  );

  return { nodes, links, nodesMap, linksMap };
}

/**
 * TODO: generalize and fix to be consistent with other parts of the code.
 * TODO: maybe we shouldn't check if all records are nodes, but instead extract nodes from the records dynamically as the graph chart deos.
 * @param records List of records got back from the Driver
 * @param fieldIndex index of the field i want to check that is just nodes
 * @returns True if all the records are Node Objects
 */
export function checkIfAllRecordsAreNodes(records, fieldIndex) {
  try {
    let res = records.every((record) => {
      return record._fields && isNode(record._fields[fieldIndex]);
    });
    return res;
  } catch (error) {
    // In any case of error, log and continue with false
    console.error(error);
    return false;
  }
}

/**
 * TODO - this functionality is duplicated in the graph chart logic.
 * Ideally, we want to have a Node/Relationship representation indipendent from the return
 * that the driver gets back.
 * @param records List of records got from the driver
 * @returns List of Object that are parsed from the Node object received from the driver
 */
export function parseNodeRecordsToDictionaries(records, fieldIndex = 0) {
  let res = records.map((record) => {
    let { identity, labels, properties } = record._fields[fieldIndex];
    // Preventing high/low fields by casting to its primitive type
    identity = identity.toNumber();
    return { id: identity, labels: labels, properties: properties };
  });
  return res;
}
