import React, { useRef } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { executeActionRule, getRuleWithFieldPropertyName } from '../../../../extensions/advancedcharts/Utils';
import { getTooltip } from '../../../../chart/graph/component/GraphChartTooltip';
import { GraphChartVisualizationProps } from '../../../../chart/graph/GraphChartVisualization';
import { generateNodeCanvasObject, getNodeLabel } from '../../../../chart/graph/util/NodeUtils';
import { generateRelCanvasObject } from '../../../../chart/graph/util/RelUtils';
import SpriteText from 'three-spritetext';
import { evaluateRulesOnNode } from '../../../styling/StyleRuleEvaluator';
import * as THREE from 'three';

/*
 * TODO: check if makes sense to change zoom logic from panning to buttons
 * (when i scroll the graphCharts has the priority )
 */
export const NeoGraphChartVisualization3D = (props: GraphChartVisualizationProps) => {
  const fgRef: React.MutableRefObject<any> = useRef();

  if (!props.style.width || !props.style.height) {
    return <></>;
  }
  props.interactivity.zoomToFit = () => fgRef.current && fgRef.current.zoomToFit(400);

  return (
    <ForceGraph3D
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
      // linkLabel={(link: any) => (props.interactivity.showPropertiesOnHover ? `<div>${getTooltip(link)}</div>` : '')}
      nodeThreeObjectExtend={true}
      nodeThreeObject={(node) => {
        const label =
          props.engine.selection && props.engine.selection[node.mainLabel]
            ? getNodeLabel(props.engine.selection, node)
            : '';
        const fontSize = props.style.nodeLabelFontSize;
        const sprite = new SpriteText(label);
        sprite.color = evaluateRulesOnNode(
          node,
          'node label color',
          props.style.nodeLabelColor,
          props.extensions.styleRules
        );
        sprite.textHeight = props.style.nodeLabelFontSize;
        return sprite;
      }}
      linkThreeObjectExtend={true}
      linkThreeObject={(link) => {
        // extend link with text sprite
        const label = link.properties.name || link.type || link.id;
        const fontSize = props.style.relLabelFontSize;
        const { source } = link;
        const { target } = link;

        const sprite = new SpriteText(label);
        sprite.color = props.style.relLabelColor;
        sprite.textHeight = fontSize;
        return sprite;
      }}
      linkPositionUpdate={(sprite, { start, end }, link) => {
        if (link.source.id !== link.target.id) {
          // If this is a relationship with a different start and end node...
          const middle = Object.assign(
            ...['x', 'y', 'z'].map((c) => ({
              [c]: start[c] + (end[c] - start[c]) / 2, // calc middle point
            }))
          );
          if (!link.curvature) {
            // Simple case - no curvature assigned, we position the label in the middle of the two nodes.
            Object.assign(sprite.position, middle);
          } else {
            // Complex case, multiple rels between a pair of nodes. Adjust the position to match each rel's curvature.
            let vector = new THREE.Vector3(end.x - start.x, end.y - start.y, end.z - start.z);
            let axis = new THREE.Vector3(0, 0, 1);
            let angle = -Math.PI / 2;
            vector = vector.applyAxisAngle(axis, angle);
            vector.multiplyScalar(0.5 * link.curvature);
            const translated = { x: middle.x + vector.x, y: middle.y + vector.y, z: middle.z + vector.z };
            Object.assign(sprite.position, translated);
          }
        } else {
          // If this is a relationship with an identical start and end node...
          const vector = { x: 26 * link.curvature, y: 26 * link.curvature, z: 0 };

          const translated = { x: start.x + vector.x, y: start.y + vector.y, z: start.z + vector.z };
          Object.assign(sprite.position, translated);
        }
      }}
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
        props.engine.setCooldownTicks(1);
        if (props.engine.recenterAfterEngineStop) {
          fgRef.current.zoomToFit(400);
          props.engine.setRecenterAfterEngineStop(false);
        }
      }}
      onZoom={() => {
        props.interactivity.setContextMenuOpen(false);
      }}
      onNodeDrag={(node) => {
        if (node) {
          props.interactivity.setContextMenuOpen(false);
          props.engine.setRecenterAfterEngineStop(false);
        }
      }}
      onNodeDragEnd={(node) => {
        if (node) {
          props.engine.setCooldownTicks(1);
          if (props.interactivity.fixNodeAfterDrag) {
            node.fx = node.x;
            node.fy = node.y;
            node.fz = node.z;
          }
          // if (props.interactivity.layoutFrozen) {
          //   const key = node.id;
          //   const val = [node.x, node.y, node.z];
          //   const old = { ...props.interactivity.nodePositions };
          //   old[key] = val;
          //   // props.interactivity.setNodePositions(old);
          // }
        }
      }}
      // nodeCanvasObjectMode={() => 'after'}
      // nodeCanvasObject={(node: any, ctx: any) =>
      //   generateNodeCanvasObject(
      //     node,
      //     ctx,
      //     props.style.nodeIcons,
      //     props.interactivity.layoutFrozen,
      //     props.interactivity.nodePositions,
      //     props.style.nodeLabelFontSize,
      //     props.style.defaultNodeSize,
      //     props.style.nodeLabelColor,
      //     props.extensions.styleRules,
      //     props.engine.selection
      //   )
      // }
      // linkCanvasObjectMode={() => 'after'}
      // linkCanvasObject={(link: any, ctx: any) =>
      //   generateRelCanvasObject(link, ctx, props.style.relLabelFontSize, props.style.relLabelColor)
      // }
      graphData={props.style.width ? { nodes: props.data.nodes, links: props.data.links } : { nodes: [], links: [] }}
    />
  );
};
