import React, { useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { executeActionRule, getRuleWithFieldPropertyName } from '../../extensions/advancedcharts/Utils';
import { getTooltip } from './component/GraphChartTooltip';
import { GraphChartVisualizationProps } from './GraphChartVisualization';
import { generateNodeCanvasObject } from './util/NodeUtils';
import { generateRelCanvasObject } from './util/RelUtils';
import { NeoGraphChartVisualizationBase } from './GraphChartVisualizationBase';

/*
 *
 */
export const NeoGraphChartVisualization2D = (props: GraphChartVisualizationProps) => {
  const config2d = {
    graphComponent: ForceGraph2D,
    cooldownAfterengineStop: 0,
    nodeCanvasObjectMode: () => 'after',
    nodeCanvasObject: (node: any, ctx: any) =>
      generateNodeCanvasObject(
        node,
        ctx,
        props.style.nodeIcons,
        props.interactivity.layoutFrozen,
        props.interactivity.nodePositions,
        props.style.nodeLabelFontSize,
        props.style.defaultNodeSize,
        props.style.nodeLabelColor,
        props.extensions.styleRules,
        props.engine.selection
      ),
    linkCanvasObjectMode: () => 'after',
    linkCanvasObject: (link: any, ctx: any) =>
      generateRelCanvasObject(link, ctx, props.style.relLabelFontSize, props.style.relLabelColor),
  };
  const props2d = { ...props, config: config2d };
  return <NeoGraphChartVisualizationBase {...props2d} />;
};
