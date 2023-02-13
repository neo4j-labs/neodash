import React, { useRef } from 'react';
import ForceGraph2D, { LinkObject } from 'react-force-graph-2d';
import { showInspectModal } from './component/GraphChartInspectModal';
import { getTooltip } from './component/GraphChartTooltip';
import { GraphChartVisualizationProps } from './GraphChartVisualization';
import { handleExpand } from './util/GraphUtils';
import { generateNodeCanvasObject } from './util/NodeUtils';
import { generateRelCanvasObject, selfLoopRotationDegrees } from './util/RelUtils';

export const NeoGraphChartVisualization2D = (props: GraphChartVisualizationProps) => {
  const fgRef = useRef();
  if (!props.style.width || !props.style.height) {
    return <></>;
  }
  return (
    <ForceGraph2D
      ref={fgRef}
      width={props.style.width - 20}
      height={props.style.height - 10}
      linkCurvature='curvature'
      backgroundColor={props.style.backgroundColor}
      linkDirectionalArrowLength={3}
      linkDirectionalArrowRelPos={1}
      dagMode={props.engine.layout}
      linkWidth={(link: any) => link.width}
      linkLabel={(link: any) => (props.interactivity.showPropertiesOnHover ? `<div>${getTooltip(link)}</div>` : '')}
      nodeLabel={(node: any) => (props.interactivity.showPropertiesOnHover ? `<div>${getTooltip(node)}</div>` : '')}
      nodeVal={(node: any) => node.size}
      onNodeClick={(item) =>
        showInspectModal(
          item,
          props.interactivity.showPropertiesOnClick,
          props.interactivity.setSelectedEntity,
          props.interactivity.setPropertyInspectorOpen
        )
      }
      // nodeThreeObject = {nodeThree}
      onLinkClick={(item) =>
        showInspectModal(
          item,
          props.interactivity.showPropertiesOnClick,
          props.interactivity.setSelectedEntity,
          props.interactivity.setPropertyInspectorOpen
        )
      }
      // onNodeRightClick={(node) => handleExpand(node, props.engine.queryCallback, props.engine.setExtraRecords)}
      linkDirectionalParticles={props.style.linkDirectionalParticles}
      linkDirectionalParticleSpeed={props.style.linkDirectionalParticleSpeed}
      cooldownTicks={props.engine.firstRun ? 100 : 1}
      onEngineStop={() => {
        if (props.engine.firstRun) {
          fgRef.current.zoomToFit(400);
          props.engine.setFirstRun(false);
        }
      }}
      onNodeDragEnd={(node) => {
        if (props.interactivity.fixNodeAfterDrag) {
          node.fx = node.x;
          node.fy = node.y;
        }
        if (props.interactivity.layoutFrozen) {
          const key = node.id;
          const val = [node.x, node.y];
          const old = { ...props.interactivity.nodePositions };
          old[key] = val;
          props.interactivity.setNodePositions(old);
        }
      }}
      nodeCanvasObjectMode={() => 'after'}
      nodeCanvasObject={(node: any, ctx: any) =>
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
        )
      }
      linkCanvasObjectMode={() => 'after'}
      linkCanvasObject={(link: any, ctx: any) =>
        generateRelCanvasObject(link, ctx, props.style.relLabelFontSize, props.style.relLabelColor)
      }
      graphData={props.style.width ? { nodes: props.data.nodes, links: props.data.links } : { nodes: [], links: [] }}
    />
  );
};
