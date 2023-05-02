import React, { useEffect } from 'react';
import { ChartProps } from '../Chart';
import { categoricalColorSchemes } from '../../config/ColorConfig';
import { valueIsArray, valueIsNode, valueIsRelationship, valueIsPath, valueIsObject } from '../../chart/ChartUtils';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { evaluateRulesOnNode, useStyleRules } from '../../extensions/styling/StyleRuleEvaluator';
import { extensionEnabled } from '../../extensions/ExtensionUtils';
import { createHeatmap } from './layers/HeatmapLayer';
import { createMarkers } from './layers/MarkerLayer';
import { createLines } from './layers/LineLayer';

const update = (state, mutations) => Object.assign({}, state, mutations);

/**
 * Renders Neo4j records as their JSON representation.
 */
const NeoMapChart = (props: ChartProps) => {
  // Retrieve config from advanced settings
  const layerType = props.settings && props.settings.layerType ? props.settings.layerType : 'markers';
  const nodeColorProp = props.settings && props.settings.nodeColorProp ? props.settings.nodeColorProp : 'color';
  const defaultNodeSize = props.settings && props.settings.defaultNodeSize ? props.settings.defaultNodeSize : 'large';
  const relWidthProp = props.settings && props.settings.relWidthProp ? props.settings.relWidthProp : 'width';
  const relColorProp = props.settings && props.settings.relColorProp ? props.settings.relColorProp : 'color';
  const defaultRelWidth = props.settings && props.settings.defaultRelWidth ? props.settings.defaultRelWidth : 3.5;
  const defaultRelColor = props.settings && props.settings.defaultRelColor ? props.settings.defaultRelColor : '#666';
  const nodeColorScheme = props.settings && props.settings.nodeColorScheme ? props.settings.nodeColorScheme : 'neodash';
  const styleRules = useStyleRules(
    extensionEnabled(props.extensions, 'styling'),
    props.settings.styleRules,
    props.getGlobalParameter
  );
  const defaultNodeColor = 'grey'; // Color of nodes without labels
  const dimensions = props.dimensions ? props.dimensions : { width: 100, height: 100 };
  const mapProviderURL =
    props.settings && props.settings.providerUrl
      ? props.settings.providerUrl
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const attribution =
    props.settings && props.settings.attribution
      ? props.settings.attribution
      : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

  const actionsRules = [];

  const [data, setData] = React.useState({ nodes: [], links: [], zoom: 0, centerLatitude: 0, centerLongitude: 0 });

  // Per pixel, scaling factors for the latitude/longitude mapping function.
  const widthScale = 8.55;
  const heightScale = 6.7;

  let key = `${dimensions.width},${dimensions.height},${data.centerLatitude},${data.centerLongitude},${props.fullscreen}`;
  useEffect(() => {
    `${data.centerLatitude},${data.centerLongitude},${props.fullscreen}`;
  }, [props.fullscreen]);

  useEffect(() => {
    buildVisualizationDictionaryFromRecords(props.records);
  }, []);

  let nodes = {};
  let nodeLabels = {};
  let links = {};
  let linkTypes = {};

  // Gets all graphy objects (nodes/relationships) from the complete set of return values.
  // TODO this should be in Utils.ts
  function extractGraphEntitiesFromField(value) {
    if (value == undefined) {
      return;
    }
    if (valueIsArray(value)) {
      value.forEach((v) => extractGraphEntitiesFromField(v));
    } else if (valueIsObject(value)) {
      if (value.label && value.id) {
        // Override for adding point nodes using a manually constructed dict.
        nodeLabels[value.label] = true;
        nodes[value.id] = {
          id: value.id,
          labels: [value.label],
          size: defaultNodeSize,
          properties: value,
          firstLabel: value.label,
        };
      } else if (value.type && value.id && value.start && value.end) {
        // Override for adding relationships using a manually constructed dict.
        if (links[`${value.start},${value.end}`] == undefined) {
          links[`${value.start},${value.end}`] = [];
        }
        const addItem = (arr, item) => arr.find((x) => x.id === item.id) || arr.push(item);
        addItem(links[`${value.start},${value.end}`], {
          id: value.id,
          source: value.start,
          target: value.end,
          type: value.type,
          width: value[relWidthProp] ? value[relWidthProp] : defaultRelWidth,
          color: value[relColorProp] ? value[relColorProp] : defaultRelColor,
          properties: value,
        });
      }
    } else if (valueIsNode(value)) {
      value.labels.forEach((l) => (nodeLabels[l] = true));
      nodes[value.identity.low] = {
        id: value.identity.low,
        labels: value.labels,
        size: defaultNodeSize,
        properties: value.properties,
        firstLabel: value.labels[0],
      };
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
        width: value.properties[relWidthProp] ? value.properties[relWidthProp] : defaultRelWidth,
        color: value.properties[relColorProp] ? value.properties[relColorProp] : defaultRelColor,
        properties: value.properties,
      });
    } else if (valueIsPath(value)) {
      value.segments.map((segment) => {
        extractGraphEntitiesFromField(segment.start);
        extractGraphEntitiesFromField(segment.relationship);
        extractGraphEntitiesFromField(segment.end);
      });
    }
  }

  // TODO this should be in Utils.ts
  function buildVisualizationDictionaryFromRecords(records) {
    // Extract graph objects from result set.
    records.forEach((record) => {
      record._fields &&
        record._fields.forEach((field) => {
          extractGraphEntitiesFromField(field);
        });
    });

    // Assign proper colors & coordinates to nodes.
    const totalColors = categoricalColorSchemes[nodeColorScheme].length;
    const nodeLabelsList = Object.keys(nodeLabels);
    const nodesList = Object.values(nodes).map((node) => {
      const assignPosition = (node) => {
        if (node.properties.latitude && node.properties.longitude) {
          nodes[node.id].pos = [parseFloat(node.properties.latitude), parseFloat(node.properties.longitude)];
          return nodes[node.id].pos;
        }
        if (node.properties.lat && node.properties.long) {
          nodes[node.id].pos = [parseFloat(node.properties.lat), parseFloat(node.properties.long)];
          return nodes[node.id].pos;
        }
        Object.values(node.properties).forEach((p) => {
          if (p != null && p.srid != null && p.x != null && p.y != null) {
            if (!isNaN(p.x) && !isNaN(p.y)) {
              nodes[node.id].pos = [p.y, p.x];
              return [p.y, p.x];
            }
          }
        });
      };

      let assignedColor = node.properties[nodeColorProp]
        ? node.properties[nodeColorProp]
        : categoricalColorSchemes[nodeColorScheme][nodeLabelsList.indexOf(node.firstLabel) % totalColors];

      assignedColor = evaluateRulesOnNode(node, 'marker color', assignedColor, styleRules);
      const assignedPos = assignPosition(node);
      return update(node, {
        pos: node.pos ? node.pos : assignedPos,
        color: assignedColor ? assignedColor : defaultNodeColor,
      });
    });

    // Assign proper curvatures to relationships.
    const linksList = Object.values(links)
      .map((nodePair) => {
        return nodePair.map((link) => {
          if (nodes[link.source] && nodes[link.source].pos && nodes[link.target] && nodes[link.target].pos) {
            return update(link, { start: nodes[link.source].pos, end: nodes[link.target].pos });
          }
        });
      })
      .flat();

    // Calculate center latitude and center longitude:

    const latitudes = nodesList.reduce((a, b) => {
      if (b.pos == undefined) {
        return a;
      }
      a.push(b.pos[0]);
      return a;
    }, []);
    const longitudes = nodesList.reduce((a, b) => {
      if (b.pos == undefined) {
        return a;
      }
      a.push(b.pos[1]);
      return a;
    }, []);
    const maxLat = Math.max(...latitudes);
    const minLat = Math.min(...latitudes);
    const avgLat = maxLat - (maxLat - minLat) / 2.0;

    let latWidthScaleFactor = (dimensions.width ? dimensions.width : 300) / widthScale;
    let latDiff = maxLat - avgLat;
    let latProjectedWidth = latDiff / latWidthScaleFactor;
    let latZoomFit = Math.ceil(Math.log2(1.0 / latProjectedWidth));

    const maxLong = Math.min(...longitudes);
    const minLong = Math.min(...longitudes);
    const avgLong = maxLong - (maxLong - minLong) / 2.0;

    let longHeightScaleFactor = (dimensions.height ? dimensions.height : 300) / heightScale;
    let longDiff = maxLong - avgLong;
    let longProjectedHeight = longDiff / longHeightScaleFactor;
    let longZoomFit = Math.ceil(Math.log2(1.0 / longProjectedHeight));
    // Set data based on result values.
    setData({
      zoom: Math.min(latZoomFit, longZoomFit),
      centerLatitude: latitudes ? latitudes.reduce((a, b) => a + b, 0) / latitudes.length : 0,
      centerLongitude: longitudes ? longitudes.reduce((a, b) => a + b, 0) / longitudes.length : 0,
      nodes: nodesList,
      links: linksList,
    });
  }

  // TODO this should definitely be refactored as an if/case statement.
  const markers = layerType == 'markers' ? createMarkers(data, props) : '';
  const lines = layerType == 'markers' ? createLines(data) : '';
  const heatmap = layerType == 'heatmap' ? createHeatmap(data, props) : '';
  // Draw the component.
  // Ideally, we want to have one component for each layer on the map, different files
  // https://stackoverflow.com/questions/69751481/i-want-to-use-useref-to-access-an-element-in-a-reat-leaflet-and-use-the-flyto
  return (
    <MapContainer
      key={key}
      style={{ width: '100%', height: '100%' }}
      center={[data.centerLatitude ? data.centerLatitude : 0, data.centerLongitude ? data.centerLongitude : 0]}
      zoom={data.zoom ? data.zoom : 0}
      maxZoom={18}
      scrollWheelZoom={false}
    >
      {heatmap}
      <TileLayer attribution={attribution} url={mapProviderURL} />
      {markers}
      {lines}
    </MapContainer>
  );
};

export default NeoMapChart;
