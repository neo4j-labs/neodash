import React from 'react';
import Marker from 'react-leaflet-enhanced-marker';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { MapPinIconSolid } from '@neo4j-ndl/react/icons';
import 'leaflet/dist/leaflet.css';
import { Popup, Tooltip } from 'react-leaflet';
import { Button, Typography } from '@neo4j-ndl/react';
import { getRule } from '../../../extensions/advancedcharts/Utils';
import { extensionEnabled } from '../../../utils/ReportUtils';

export function createMarkers(data, props) {
  const clusterMarkers = props.settings?.clusterMarkers ? props.settings.clusterMarkers : false;
  const separateOverlappingMarkers = props.settings?.separateOverlappingMarkers
    ? props.settings.separateOverlappingMarkers
    : false;

  const defaultNodeSize = props.settings && props.settings.defaultNodeSize ? props.settings.defaultNodeSize : 'large';
  const actionsRules =
    extensionEnabled(props.extensions, 'actions') && props.settings && props.settings.actionsRules
      ? props.settings.actionsRules
      : [];

  let markerMarginTop;
  let markerIconClass;
  let markerMarginLeft;
  // Render a node label tooltip
  switch (defaultNodeSize) {
    case 'large':
      markerMarginTop = '-20px';
      markerMarginLeft = '0px';
      markerIconClass = '';
      break;
    case 'medium':
      markerMarginTop = '-5px';
      markerMarginLeft = '2px';
      markerIconClass = 'btn-icon-lg-r';
      break;
    default:
      markerMarginTop = '6px';
      markerMarginLeft = '10px';
      markerIconClass = 'btn-icon-base-r';
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
                let rule = getRule(
                  { field: k.toString(), value: value.properties[k].toString() },
                  actionsRules,
                  'Click'
                );
                let execRule =
                  rule !== null &&
                  rule[0] !== null &&
                  rule[0].customization == 'set variable' &&
                  props &&
                  props.setGlobalParameter;

                return (
                  <tr
                    key={i}
                    onClick={() => {
                      if (execRule) {
                        // call thunk for $neodash_customizationValue
                        props.setGlobalParameter(`neodash_${rule.customizationValue}`, value.properties[k].toString());
                      }
                    }}
                  >
                    <td style={{ marginRight: '10px' }} key={0}>
                      {k.toString()}:
                    </td>
                    <td key={1}>
                      {execRule ? (
                        <Button
                          style={{ width: '100%', marginLeft: '10px', marginRight: '10px' }}
                          color='primary'
                          onClick={() => {
                            if (execRule) {
                              // call thunk for $neodash_customizationValue
                              props.setGlobalParameter(
                                `neodash_${rule[0].customizationValue}`,
                                value.properties[k].toString()
                              );
                            }
                          }}
                        >{`${value.properties[k].toString()}`}</Button>
                      ) : (
                        value.properties[k].toString()
                      )}
                    </td>
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
          <div
            style={{ color: node.color, textAlign: 'center', marginTop: markerMarginTop, marginLeft: markerMarginLeft }}
          >
            <MapPinIconSolid className={markerIconClass} />
          </div>
        }
      >
        {props.selection && props.selection[node.firstLabel] && props.selection[node.firstLabel] != '(no label)' ? (
          <Tooltip direction='bottom' permanent className={'leaflet-custom-tooltip'} disableInteractive>
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
  } else {
    markers = (
      <MarkerClusterGroup chunkedLoading maxClusterRadius={separateOverlappingMarkers ? 5 : 0}>
        {markers}
      </MarkerClusterGroup>
    );
  }
  return markers;
}
