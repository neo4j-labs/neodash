import React, { useRef } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

import { GraphChartVisualizationProps } from '../../../../chart/graph/GraphChartVisualization';
import { generateNodeCanvasObject, getNodeLabel } from '../../../../chart/graph/util/NodeUtils';
import { generateRelCanvasObject } from '../../../../chart/graph/util/RelUtils';
import SpriteText from 'three-spritetext';
import { evaluateRulesOnNode } from '../../../styling/StyleRuleEvaluator';
import { NeoGraphChartVisualizationBase } from '../../../../chart/graph/GraphChartVisualizationBase';
import * as THREE from 'three';

/*
 *
 */
export const NeoGraphChartVisualization3D = (props: GraphChartVisualizationProps) => {
  const config3d = {
    graphComponent: ForceGraph3D,
    cooldownAfterengineStop: 1,
    nodeThreeObjectExtend: true,
    nodeThreeObject: (node) => {
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
    },
    linkThreeObjectExtend: true,
    linkThreeObject: (link) => {
      // extend link with text sprite
      const label = link.properties.name || link.type || link.id;
      const fontSize = props.style.relLabelFontSize;
      const sprite = new SpriteText(label);
      sprite.color = props.style.relLabelColor;
      sprite.textHeight = fontSize;
      return sprite;
    },
    linkPositionUpdate: (sprite, { start, end }, link) => {
      if (link.source.id !== link.target.id) {
        // If this is a relationship with a different start and end node...
        const middle = Object.assign(
          ...['x', 'y', 'z'].map((c) => ({
            [c]: start[c] + (end[c] - start[c]) / 2, // calc middle point
          }))
        );
        // TODO rotation https://codepen.io/prisoner849/pen/BaVZKWW
        // sprite.material.rotation = Math.random()
        // sprite.lookAt(target);
        // let v2 = new THREE.Vector2();
        // let v3 = new THREE.Vector3();
        // // let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
        // let camera = null;
        // console.log(sprite);
        // v3.copy(middle).project(camera);
        // v3.x *= camera.aspect;
        // v2.copy(end);
        // v2.x *= camera.aspect;
        // v2.sub(v3);

        // sprite.material.map.rotation = v2.angle();

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
    },
  };
  const props3d = { ...props, config: config3d };
  return <NeoGraphChartVisualizationBase {...props3d} />;
};
