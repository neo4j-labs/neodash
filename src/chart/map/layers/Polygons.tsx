import React, { useState, useEffect } from 'react';
import { useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Button from '@material-ui/core/Button';

function componentToHex(c) {
  let hex = c.toString(16);
  return hex.length == 1 ? `0${  hex}` : hex;
}

function rgbToHex(r, g, b) {
  return `#${  componentToHex(r)  }${componentToHex(g)  }${componentToHex(b)}`;
}

function pickHex(weight) {
  if (weight < 0) {
    return [220, 220, 220];
  }
  let color1 = [255, 0, 0];
  let color2 = [255, 0, 0];
  let w1 = weight;
  let w2 = 1 - w1;
  let rgb = [
    Math.round(color1[0] * w1 + color2[0] * w2),
    Math.round(color1[1] * w1 + color2[1] * w2),
    Math.round(color1[2] * w1 + color2[2] * w2),
  ];
  let hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
  return hex;
}

function randomString() {
  return (`${Math.random().toString(36)  }00000000000000000`).slice(2, 16);
}

// drill down function, to add more logic in future
function getDrillDown(geoJson, id, features, key) {
  console.log(geoJson);
  let data = Object.values(features).filter((x) => {
    return x.properties[key] === id;
  });

  // We don't want to re-render if there is no data in the drillDown
  if (data.length == 0) {
    return [geoJson];
  }
  return data;
}

/**
 * Function used to bind the data from the query with each geojson
 * @param geoData
 * @param geoJsonData
 * @returns
 */
function bindDataToMap(geoData, geoJsonData) {
  let newValues = {};
  Object.keys(geoData).forEach((key) => {
    let tmp;
    if (geoJsonData[key] != undefined) {
      tmp = Object.assign({}, geoJsonData[key]);
      tmp.properties.neo_value = geoData[key];
      newValues[key] = tmp;
    }
  });
  // Deepcopying data to prevent strange behaviors
  let geoJsonData_copy = Object.assign(geoJsonData, {});
  let res = Object.assign(geoJsonData_copy, newValues);

  // Returning the list of features
  return Object.values(res);
}

// Wraps the boundary logic function
export const MapBoundary = ({ data, props, featureLevel0, featureLevel1 }) => {
  const level0key = 'SHORT_COUNTRY_CODE';
  const level1key = 'COMPOSITE_REGION_CODE';

  const isDrillDownEnabled = props.settings && props.settings.mapDrillDown ? props.settings.mapDrillDown : false;

  // Final polygon data
  const [polygonData, setPolygonData] = useState([]);

  // Key of the current geoJson viz and currently selected geoJson
  const [state, setState] = useState({ key: 'firstAll', geoJson: undefined });

  // Key used to prevent race condition
  const [key, setKey] = React.useState('firstAll');

  useEffect(() => {
    let currentKey =
      state.geoJson != undefined && Object.keys(state.geoJson.properties).includes(level1key) ? level1key : level0key;
    let tmp =
      state.geoJson === undefined
        ? featureLevel0
        : getDrillDown(state.geoJson, state.geoJson.properties[currentKey], featureLevel1, currentKey);
    setPolygonData(bindDataToMap(data, tmp));
    // Synchronizing the key with the state key to retrigger rendering
    setKey(state.key);
  }, [state]);

  // Getting the upper level Map
  const map = useMap();

  // Button to reset the view and the whole drilldown
  function ResetButton() {
    // Binding the button to the map
    const map = useMap();
    function onClick() {
      setState({ key: randomString(), geoJson: undefined });
      map.setZoom(1);
      return null;
    }

    return (
      <div className='btnWrapper' style={{ zIndex: 1001, position: 'absolute', top: 10, right: 10 }}>
        <Button variant='contained' onClick={onClick}>
          Reset View
        </Button>
      </div>
    );
  }

  function onDrillDown(e) {
    setState({ key: randomString(), geoJson: e.target.feature });
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(_, layer) {
    if (isDrillDownEnabled) {
      layer.on({
        click: onDrillDown,
      });
    }
  }

  const geoJSONStyle = (_feature) => {
    let weight = _feature.properties.neo_value != undefined ? _feature.properties.neo_value : -1;
    console.log(pickHex(weight));
    let style = {
      color: '#1f2021',
      weight: 1,
      fillOpacity: 0.5,
      fillColor: pickHex(weight),
    };
    return style;
  };

  const resetButton = ResetButton();

  // We need data or synchronized keys to enable re-render
  if (polygonData.length == 0 || key !== state.key) {
    return <></>;
  }

  const geoJsonLayer = (
    <div>
      {resetButton}
      <GeoJSON
        id='polygonId'
        key={state.key}
        data={polygonData}
        style={geoJSONStyle}
        onEachFeature={onEachFeature}
      ></GeoJSON>
    </div>
  );

  return geoJsonLayer;
};
