import React from 'react';
import Marker from 'react-leaflet-enhanced-marker';
import MarkerClusterGroup from 'react-leaflet-cluster';
import LocationOn from '@mui/icons-material/LocationOn';
import 'leaflet/dist/leaflet.css';
import { Popup, Tooltip } from 'react-leaflet';
import { Typography } from '@neo4j-ndl/react';

export function createMarkers(data, props) {
  const clusterMarkers =
    props.settings && typeof props.settings.clusterMarkers !== 'undefined' ? props.settings.clusterMarkers : false;
  const defaultNodeSize = props.settings && props.settings.defaultNodeSize ? props.settings.defaultNodeSize : 'large';
  const actionsRules = [];

  let markerMarginTop;
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

  function createPopupFromNodeProperties(value) {
    return (
      <Popup className={'leaflet-custom-node-popup'}>
        <Typography variant='h4'>
          <b>{value.labels.length > 0 ? value.labels.map((b) => `${b} `) : '(No labels)'}</b>
        </Typography>
        <table>
          <tbody>
            {Object.keys(value.properties).length == 0 ? (
              <tr>
                <td>(No properties)</td>
              </tr>
            ) : (
              Object.keys(value.properties).map((k, i) => {
                // TODO MOVE THIS DEPENDENCY OUT OF THE TOOLTIP GENERATION

                return (
                  <tr key={i} onClick={() => {}}>
                    <td style={{ marginRight: '10px' }} key={0}>
                      {k.toString()}:
                    </td>
                    <td key={1}>value.properties[k].toString()</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Popup>
    );
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

  // Create markers to plot on the map
  let markers = data.nodes
    .filter((node) => node.pos && !isNaN(node.pos[0]) && !isNaN(node.pos[1]))
    .map((node, i) => (
      <Marker
        position={node.pos}
        key={i}
        icon={
          <div style={{ color: node.color, textAlign: 'center', marginTop: markerMarginTop }}>
            <LocationOn fontSize={node.size}></LocationOn>
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
