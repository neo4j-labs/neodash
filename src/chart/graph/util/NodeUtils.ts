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
  const selection = propertySelections[entity[sourceOrTarget]?.mainLabel];
  switch (selection) {
    case '(label)':
      return entity[sourceOrTarget]?.mainLabel;
    case '(id)':
      return entity[sourceOrTarget]?.id;
    default:
      return entity[sourceOrTarget]?.properties[selection];
  }
};

const getRelPatternString = (entity: any, selection: any) => {
  const sourceTitle = getSelectedNodeProperty(entity, 'source', selection);
  const targetTitle = getSelectedNodeProperty(entity, 'target', selection);
  return `(${sourceTitle ? sourceTitle : '[no value]'} --> ${targetTitle ? targetTitle : '[no value]'})`;
};

export const getEntityHeader = (entity: any, selection: any) => {
  return entity.labels?.join(', ') || `${entity.type} ${getRelPatternString(entity, selection)}`;
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
