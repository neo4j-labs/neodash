import { evaluateRulesOnNode } from '../../../extensions/styling/StyleRuleEvaluator';
import { valueIsArray, valueIsNode, valueIsRelationship, valueIsPath } from '../../ChartUtils';
import { getCurvature } from './RelUtils';

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
  records: Record<string, any>[],
  nodes: Record<string, any>[],
  links: Record<string, any>[],
  nodeLabels: Record<string, any>,
  linkTypes: Record<string, any>,
  colorScheme: any,
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
  const linksList = Object.values(links).map((link) => {
    return link.map((link, i) => {
      if (link.source == link.target) {
        // Self-loop
        return update(link, { curvature: 0.4 + i / 8 });
      }
      // If we also have edges from the target to the source, adjust curvatures accordingly.
      const mirroredNodePair = links[`${link.target},${link.source}`];
      if (!mirroredNodePair) {
        return update(link, { curvature: getCurvature(i, link.length) });
      }
      return update(link, {
        curvature:
          (link.source > link.target ? 1 : -1) *
          getCurvature(
            link.source > link.target ? i : i + mirroredNodePair.length,
            link.length + mirroredNodePair.length
          ),
      });
    });
  });

  // Assign proper colors to nodes.
  const totalColors = colorScheme ? colorScheme.length : 0;
  const nodeLabelsList = Object.keys(nodeLabels);
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
