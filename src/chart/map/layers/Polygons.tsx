import React, { useState, useEffect } from 'react';
import { useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Button from '@material-ui/core/Button';
import '../styles/polygonStyle.css';
import { categoricalColorSchemes } from '../../../config/ColorConfig';

function getLegendRange(min, max, lenRange) {
  let diff = (max - min) / lenRange;
  // If the difference is 0 or less (strange that can be less, but you never know)
  // Return only one value
  if (diff <= 0) {
    return [Math.round(min * 100) / 100];
  }
  return [...Array(lenRange).keys()].map((i) => {
    return Math.round((min + diff * i) * 100) / 100;
  });
}

function randomString() {
  return `${Math.random().toString(36)}00000000000000000`.slice(2, 16);
}

// drill down function, to add more logic in future
function getDrillDown(geoJson, id, features, key) {
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
    } else {
      console.log(`Missing key in Polygon Map :  ${  key  } with value${  geoData[key]}`);
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

  // Getting the list of colors from the scheme (for now, starting from a scheme, we always get the last color of the scheme)
  const colorScheme =
    props.settings && props.settings.colors
      ? categoricalColorSchemes[props.settings.colors]
      : categoricalColorSchemes.YlOrRd;
  const listColors = Array.isArray(colorScheme)
    ? Array.isArray(colorScheme.slice(-1)[0])
      ? colorScheme.slice(-1)[0]
      : colorScheme
    : colorScheme;

  const minValue = data && !isNaN(data.min) ? Math.round(data.min * 100) / 100 : undefined;
  const maxValue = data && !isNaN(data.max) ? Math.round(data.max * 100) / 100 : undefined;
  const geoData = data && data.data ? data.data : {};

  // Final polygon data
  const [polygonData, setPolygonData] = useState([]);

  // Key of the current geoJson viz and currently selected geoJson
  const [state, setState] = useState({ key: 'firstAll', geoJson: undefined });

  // Key used to prevent race condition
  const [key, setKey] = React.useState('firstAll');
  const [legendRange, setLegendRange] = React.useState([]);

  useEffect(() => {
    let currentKey =
      state.geoJson != undefined && Object.keys(state.geoJson.properties).includes(level1key) ? level1key : level0key;
    let tmp =
      state.geoJson === undefined
        ? featureLevel0
        : getDrillDown(state.geoJson, state.geoJson.properties[currentKey], featureLevel1, currentKey);
    setPolygonData(bindDataToMap(geoData, tmp));
    // Getting the new legend
    let legendRange = minValue && maxValue ? getLegendRange(minValue, maxValue, listColors.length) : [];
    setLegendRange(legendRange);
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

  function Legend(colors, legendRange) {
    return (
      <div className='info legend' style={{ zIndex: 1001, position: 'absolute', bottom: 30, right: 30 }}>
        {legendRange.map((from, i, legendRange) => {
          let to = legendRange[i + 1];
          return (
            <div>
              <i style={{ background: colors[i] }}> &nbsp;&nbsp; </i>
              &nbsp; {from} {to ? `- ${  to}` : i > 0 ? '+' : ''}
              <br />
            </div>
          );
        })}
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
    function getColor(weight, legendRange, listColors) {
      let index = legendRange.findIndex((number) => {
        return number >= weight;
      });
      return listColors[index];
    }
    let weight = _feature.properties.neo_value != undefined ? _feature.properties.neo_value : undefined;
    let color = weight ? getColor(weight, legendRange, listColors) : 'gray';
    let style = {
      color: '#1f2021',
      weight: 1,
      fillOpacity: 0.8,
      fillColor: color,
    };
    return style;
  };

  const resetButton = ResetButton();
  const legend = minValue && maxValue ? Legend(listColors, legendRange) : <></>;
  // We need data or synchronized keys to enable re-render
  if (polygonData.length == 0 || key !== state.key) {
    return <></>;
  }

  const geoJsonLayer = (
    <div>
      {resetButton}
      {legend}
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
