import React, { useEffect } from 'react';
import { ChartProps } from '../Chart';
import { categoricalColorSchemes } from '../../config/ColorConfig';
import { valueIsArray, valueIsNode, valueIsRelationship, valueIsPath, valueIsObject } from '../../chart/ChartUtils';
import { MapContainer, Polyline, Popup, TileLayer, Tooltip } from 'react-leaflet';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';
import Marker from 'react-leaflet-enhanced-marker';
import MarkerClusterGroup from 'react-leaflet-cluster';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import 'leaflet/dist/leaflet.css';
import { evaluateRulesOnNode } from '../../extensions/styling/StyleRuleEvaluator';
import { extensionEnabled } from '../../extensions/ExtensionUtils';

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
  const styleRules =
    extensionEnabled(props.extensions, 'styling') && props.settings && props.settings.styleRules
      ? props.settings.styleRules
      : [];
  const clusterMarkers =
    props.settings && typeof props.settings.clusterMarkers !== 'undefined' ? props.settings.clusterMarkers : false;
  const intensityProp = props.settings && props.settings.intensityProp ? props.settings.intensityProp : '';
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

  const [data, setData] = React.useState({ nodes: [], links: [], zoom: 0, centerLatitude: 0, centerLongitude: 0 });

  // Per pixel, scaling factors for the latitude/longitude mapping function.
  const widthScale = 8.55;
  const heightScale = 6.7;

  let markerMarginTop;

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

  if (layerType == 'markers') {
    // Render a node label tooltip
    switch (defaultNodeSize) {
      case 'large':
        markerMarginTop = '-5px';
        break;
      case 'medium':
        markerMarginTop = '3px';
        break;
      default:
        markerMarginTop = '6px';
        break;
    }
  }

  const renderNodeLabel = (node) => {
    const selectedProp = props.selection && props.selection[node.firstLabel];
    if (selectedProp == '(id)') {
      return node.id;
    }
    if (selectedProp == '(label)') {
      return node.labels;
    }
    if (selectedProp == '(no label)') {
      return '';
    }
    return node.properties[selectedProp] ? node.properties[selectedProp].toString() : '';
  };

  function createMarkers() {
    // Create markers to plot on the map
    let markers = data.nodes
      .filter((node) => node.pos && !isNaN(node.pos[0]) && !isNaN(node.pos[1]))
      .map((node, i) => (
        <Marker
          position={node.pos}
          key={i}
          icon={
            <div style={{ color: node.color, textAlign: 'center', marginTop: markerMarginTop }}>
              <LocationOnIcon fontSize={node.size}></LocationOnIcon>
            </div>
          }
        >
          {props.selection && props.selection[node.firstLabel] && props.selection[node.firstLabel] != '(no label)' ? (
            <Tooltip direction='bottom' permanent className={'leaflet-custom-tooltip'}>
              {renderNodeLabel(node)}
            </Tooltip>
          ) : (
            <></>
          )}
          {createPopupFromNodeProperties(node)}
        </Marker>
      ));
    if (clusterMarkers) {
      markers = <MarkerClusterGroup chunkedLoading>{markers}</MarkerClusterGroup>;
    }
    return markers;
  }

  function createLines() {
    // Create lines to plot on the map.
    return data.links
      .filter((link) => link)
      .map((rel, i) => {
        if (rel.start && rel.end) {
          return (
            <Polyline weight={rel.width} key={i} positions={[rel.start, rel.end]} color={rel.color}>
              {createPopupFromRelProperties(rel)}
            </Polyline>
          );
        }
      });
  }

  function createHeatmap() {
    // Create Heatmap layer to add on top of the map
    let points = data.nodes
      .filter((node) => node.pos && !isNaN(node.pos[0]) && !isNaN(node.pos[1]))
      .map((node) => [node.pos[0], node.pos[1], intensityProp == '' ? 1 : extractIntensityProperty(node)]);
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

  function extractIntensityProperty(node) {
    // Extract the intensity property from a node.
    if (node.properties[intensityProp]) {
      // Parse int from Neo4j Integer type if it has this type
      // Or return plain value (if already parsed as a standard integer or float)
      return node.properties[intensityProp].low ?? node.properties[intensityProp];
    }
    return 0;
  }

  // Helper function to convert property values to string for the pop-ups.
  function convertMapPropertyToString(property) {
    if (property.srid) {
      return `(lat:${property.y}, long:${property.x})`;
    }
    return property;
  }

  function createPopupFromRelProperties(value) {
    return (
      <Popup className={'leaflet-custom-rel-popup'}>
        <h3>
          <b>{value.type}</b>
        </h3>
        <table>
          <tbody>
            {Object.keys(value.properties).length == 0 ? (
              <tr>
                <td>(No properties)</td>
              </tr>
            ) : (
              Object.keys(value.properties).map((k, i) => (
                <tr key={i}>
                  <td style={{ marginRight: '10px' }} key={0}>
                    {k.toString()}:
                  </td>
                  <td key={1}>{value.properties[k].toString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Popup>
    );
  }

  function createPopupFromNodeProperties(value) {
    return (
      <Popup className={'leaflet-custom-node-popup'}>
        <h3>
          <b>{value.labels.length > 0 ? value.labels.map((b) => `${b} `) : '(No labels)'}</b>
        </h3>
        <table>
          <tbody>
            {Object.keys(value.properties).length == 0 ? (
              <tr>
                <td>(No properties)</td>
              </tr>
            ) : (
              Object.keys(value.properties).map((k, i) => (
                <tr key={i}>
                  <td style={{ marginRight: '10px' }} key={0}>
                    {k.toString()}:
                  </td>
                  <td key={1}>{value.properties[k].toString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Popup>
    );
  }

  // TODO this should definitely be refactored as an if/case statement.
  const markers = layerType == 'markers' ? createMarkers() : '';
  const lines = layerType == 'markers' ? createLines() : '';
  const heatmap = layerType == 'heatmap' ? createHeatmap() : '';

  // Draw the component.
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
