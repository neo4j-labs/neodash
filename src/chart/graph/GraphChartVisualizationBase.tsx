import React, { useRef } from 'react';
import { executeActionRule, getRuleWithFieldPropertyName } from '../../extensions/advancedcharts/Utils';
import { getTooltip } from './component/GraphChartTooltip';
import { GraphChartVisualizationProps } from './GraphChartVisualization';

export const NeoGraphChartVisualizationBase = (props: GraphChartVisualizationProps) => {
  const fgRef: React.MutableRefObject<any> = useRef();
  const GraphComponent = props.config?.graphComponent;
  if (!props.style.width || !props.style.height) {
    return <></>;
  }
  props.interactivity.zoomToFit = () => fgRef.current && fgRef.current.zoomToFit(400);
  return (
    <GraphComponent
      ref={fgRef}
      width={props.style.width - 20}
      height={props.style.height}
      linkCurvature='curvature'
      backgroundColor={props.style.backgroundColor}
      linkDirectionalArrowLength={props.style.linkDirectionalArrowLength}
      linkDirectionalArrowRelPos={1}
      dagMode={props.engine.layout}
      dagLevelDistance={props.engine.graphDepthSep}
      linkWidth={(link: any) => link.width}
      linkLabel={(link: any) => (props.interactivity.showPropertiesOnHover ? `<div>${getTooltip(link)}</div>` : '')}
      nodeLabel={(node: any) => (props.interactivity.showPropertiesOnHover ? `<div>${getTooltip(node)}</div>` : '')}
      nodeVal={(node: any) => node.size}
      onNodeClick={(item) => {
        let rules = getRuleWithFieldPropertyName(item, props.extensions.actionsRules, 'onNodeClick', 'labels');
        rules != null
          ? rules.forEach((rule) => executeActionRule(rule, item, { ...props.interactivity }))
          : props.interactivity.onNodeClick(item);
      }}
      onLinkClick={(item) => {
        let rules = getRuleWithFieldPropertyName(item, props.extensions.actionsRules, 'onLinkClick', 'type');
        rules != null
          ? rules.forEach((rule) => executeActionRule(rule, item, props.interactivity.setGlobalParameter))
          : props.interactivity.onRelationshipClick(item);
      }}
      onNodeRightClick={(node, event) => props.interactivity.onNodeRightClick(node, event)}
      onLinkRightClick={(link, event) => props.interactivity.onRelationshipRightClick(link, event)}
      onBackgroundClick={() => props.interactivity.onNodeClick(undefined)}
      onBackgroundRightClick={() => props.interactivity.onNodeClick(undefined)}
      linkLineDash={(link) => (link.new ? [2, 1] : null)}
      linkDirectionalParticles={props.style.linkDirectionalParticles}
      linkDirectionalParticleSpeed={props.style.linkDirectionalParticleSpeed}
      cooldownTicks={props.engine.cooldownTicks}
      onEngineStop={() => {
        props.engine.setCooldownTicks(props.config.cooldownAfterengineStop);
        if (props.engine.recenterAfterEngineStop) {
          fgRef.current.zoomToFit(400);
          props.engine.setRecenterAfterEngineStop(false);
        }
      }}
      onZoom={() => {
        props.interactivity.setContextMenuOpen(false);
      }}
      onNodeDrag={() => {
        props.interactivity.setContextMenuOpen(false);
        props.engine.setCooldownTicks(1);
        props.engine.setRecenterAfterEngineStop(false);
      }}
      onNodeDragEnd={(node) => {
        props.engine.setCooldownTicks(props.config.cooldownAfterengineStop);
        if (props.interactivity.fixNodeAfterDrag) {
          node.fx = node.x;
          node.fy = node.y;
          if (node.z !== undefined) {
            node.fz = node.z;
          }
        }
        // TODO - Frozen layout only works in 2D
        if (props.interactivity.layoutFrozen) {
          const key = node.id;
          const val = [node.x, node.y];
          const old = { ...props.interactivity.nodePositions };
          old[key] = val;
          props.interactivity.setNodePositions(old);
        }
      }}
      // 2D-specific config settings
      nodeCanvasObjectMode={props.config?.nodeCanvasObjectMode}
      nodeCanvasObject={props.config?.nodeCanvasObject}
      linkCanvasObjectMode={props.config?.linkCanvasObjectMode}
      linkCanvasObject={props.config?.linkCanvasObject}
      // 3D-specific config settings
      nodeThreeObjectExtend={props.config?.nodeThreeObjectExtend}
      nodeThreeObject={props.config?.nodeThreeObject}
      linkThreeObjectExtend={props.config?.linkThreeObjectExtend}
      linkThreeObject={props.config?.linkThreeObject}
      linkPositionUpdate={(sprite, { start, end }, link) =>
        props.config?.linkPositionUpdate(sprite, { start, end }, link, fgRef)
      }
      // Data to populate graph
      graphData={props.style.width ? { nodes: props.data.nodes, links: props.data.links } : { nodes: [], links: [] }}
    />
  );
};
