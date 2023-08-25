import { evaluateRulesOnNode } from '../../../extensions/styling/StyleRuleEvaluator';
import { GraphEntity } from '../GraphChartVisualization';

export const getNodeLabel = (selection, node) => {
  const selectedProp = selection && selection[node.mainLabel];
  if (selectedProp == '(id)') {
    return node.id;
  }
  if (selectedProp == '(label)') {
    return node.labels;
  }
  if (selectedProp == '(no label)') {
    return '';
  }
  return node.properties[selectedProp] ? node.properties[selectedProp] : '';
};

export const parseNodeIconConfig = (iconStyle) => {
  try {
    return iconStyle ? JSON.parse(iconStyle) : undefined;
  } catch (error) {
    // Unable to parse node icon definition as specified by the user.
    console.log(error);
  }
};
const getSelectedNodeProperty = (entity: any, sourceOrTarget: string, propertySelections: any) => {
  const sourceOrTargetLabel = propertySelections[entity[sourceOrTarget]?.labels[0]];
  return entity[sourceOrTarget]?.properties[sourceOrTargetLabel];
};

export const getEntityHeaderForEdge = (entity: any, propertySelections: any) => {
  const sourceTitle = getSelectedNodeProperty(entity, 'source', propertySelections);
  const targetTitle = getSelectedNodeProperty(entity, 'target', propertySelections);
  return (
    (entity?.labels && `${sourceTitle} >> ${entity.labels.join(', ')} >> ${targetTitle}`) ||
    `${entity.type} (${sourceTitle} --> ${targetTitle})`
  );
};

export const getEntityHeader = (entity: any) => {
  return (entity?.labels && entity.labels.join(', ')) || entity.type;
};

export const drawDataURIOnCanvas = (node, strDataURI, canvas, defaultNodeSize) => {
  let img = new Image();
  let prop = defaultNodeSize * 6;
  img.src = strDataURI;
  canvas.drawImage(img, node.x - prop / 2, node.y - prop / 2, prop, prop);
};

export const generateNodeCanvasObject = (
  node: GraphEntity,
  ctx: any,
  icons: any,
  frozen: boolean,
  nodePositions: Record<string, any>,
  nodeLabelFontSize: number,
  defaultNodeSize: any,
  nodeLabelColor: any,
  styleRules: any,
  selection: any
) => {
  if (icons && icons[node.mainLabel]) {
    drawDataURIOnCanvas(node, icons[node.mainLabel], ctx, defaultNodeSize);
  } else {
    const label = selection && selection[node.mainLabel] ? getNodeLabel(selection, node) : '';
    const fontSize = nodeLabelFontSize;
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.fillStyle = evaluateRulesOnNode(node, 'node label color', nodeLabelColor, styleRules);
    ctx.textAlign = 'center';
    ctx.fillText(label, node.x ? node.x : 0, node.y ? node.y + 1 : 0);
    if (frozen && !node.fx && !node.fy && nodePositions) {
      node.fx = node.x;
      node.fy = node.y;
      nodePositions[`${node.id}`] = [node.x, node.y];
    }
    if (!frozen && node.fx && node.fy && nodePositions && nodePositions[node.id]) {
      nodePositions[node.id] = undefined;
      node.fx = undefined;
      node.fy = undefined;
    }
  }
};
