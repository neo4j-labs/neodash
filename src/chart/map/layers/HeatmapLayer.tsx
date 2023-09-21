import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';
import 'leaflet/dist/leaflet.css';
import React from 'react';

/**
 *  Create Heatmap layer to add on top of the map
 */
export function createHeatmap(data, props) {
  /**
   *  Extract the intensity property from a node.
   */
  const extractIntensityProperty = (node, intensityProp) => {
    //
    if (node.properties[intensityProp]) {
      // Parse int from Neo4j Integer type if it has this type
      // Or return plain value if already parsed as Integer or Float
      return node.properties[intensityProp].low ?? node.properties[intensityProp];
    }
    return 0;
  };
  const intensityProp = props.settings && props.settings.intensityProp ? props.settings.intensityProp : '';

  let points = data.nodes
    .filter((node) => node.pos && !isNaN(node.pos[0]) && !isNaN(node.pos[1]))
    .map((node) => [node.pos[0], node.pos[1], intensityProp == '' ? 1 : extractIntensityProperty(node, intensityProp)]);

  return (
    <HeatmapLayer
      fitBoundsOnLoad
      fitBoundsOnUpdate
      points={points}
      longitudeExtractor={(m) => m[1]}
      latitudeExtractor={(m) => m[0]}
      intensityExtractor={(m) => parseFloat(m[2])}
    />
  );
}
