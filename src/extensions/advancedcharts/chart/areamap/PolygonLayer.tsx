import React, { useState, useEffect } from 'react';
import { useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Button from '@material-ui/core/Button';
import './styles/PolygonStyle.css';
import { categoricalColorSchemes } from '../../../../config/ColorConfig';
import { abbreviateNumber } from '../../../../chart/map/MapUtils';

/**
 * Creates the list of values that will be used for the legend
 * @param min Minimum of the legend
 * @param max Maximum of the legend
 * @param lenRange Number of buckets
 * @returns List of numbers
 */
function getLegendRange(min, max, legendLength) {
  let diff = (max - min) / legendLength;
  // If the difference is 0 or less (strange that can be less, but you never know)
  // Return only one value
  if (diff <= 0) {
    return [Math.round(min * 100) / 100];
  }
  return [...Array(legendLength).keys()].map((i) => {
    return Math.round((min + diff * i) * 100) / 100;
  });
}

/**
 * Function to return a random string, right now useful to retrigger the GeoJson rendering
 * @returns A random string
 */
function randomString() {
  return `${Math.random().toString(36)}00000000000000000`.slice(2, 16);
}

/**
 * Function responsible of getting the regions inside a country
 * @param geoJson geoJson clicked on the UI, if we can't find anything we still show the clicked geoJson
 * @param features Object that matches an id to it's polygon
 * @param key Name of the parameter that will be used to match a polygon adn it's components
 * @returns feature object filtered of the useless objects
 */
function getDrillDown(geoJson, features, key, keepConflict = false) {
  let id = geoJson.properties[key];
  let polygonsToKeep = Object.keys(features).filter((polygonId) => {
    let tmp = features[polygonId];

    // Some regions can be disputed between two or more countries
    let toDrillDown =
      key === 'SHORT_COUNTRY_CODE' && tmp.properties.POSSIBLE_COUNTRIES && keepConflict
        ? tmp.properties.POSSIBLE_COUNTRIES.includes(id)
        : tmp.properties[key] === id;
    return toDrillDown;
  });

  // We don't want to re-render if there is no data in the drillDown
  if (polygonsToKeep.length == 0) {
    return [geoJson];
  }

  // Creating a dictionary that is just a filtered version of  features
  let res = {};
  polygonsToKeep.map((id) => {
    res[id] = features[id];
  });
  return res;
}

/**
 * Function used to bind the data from the query with each geojson
 * @param geoData Data parsed from the query results
 * @param geoJsonData geoJson data that needs to be joined with the query results
 * @returns
 */
function bindDataToMap(geoData, geoJsonData) {
  let newValues = {};
  let listValues: any[] = [];
  Object.keys(geoData).forEach((key) => {
    let tmp;
    if (geoJsonData[key] != undefined) {
      tmp = Object.assign({}, geoJsonData[key]);
      tmp.properties.neo_value = geoData[key];
      listValues.push(geoData[key]);
      newValues[key] = tmp;
    } else {
      // console.log(`Missing key in Polygon Map :  ${key} with value ${geoData[key]}`);
    }
  });

  // Deepcopying data to prevent strange behaviors
  let geoJsonData_copy = Object.assign(geoJsonData, {});
  let res = Object.assign(geoJsonData_copy, newValues);

  // Sorting the values to get min and max
  listValues.sort((a, b) => {
    return a - b;
  });
  // Returning the list of features
  return [Object.values(res), listValues[0], listValues.slice(-1)[0]];
}

// Wraps the boundary logic function
export const MapBoundary = ({ dimensions, data, props, featureLevel0, featureLevel1 }) => {
  // Keys used for the drill down
  // (right now only 0 is useful but important to keep in mind that we can add more levels)
  const level0key = 'SHORT_COUNTRY_CODE';
  const level1key = 'isoCode';
  const isLegendEnabled = props.settings && props.settings.showLegend != undefined ? props.settings.showLegend : true;
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

  // Final polygon data
  const [polygonData, setPolygonData] = useState([]);

  // Key of the current geoJson viz and currently selected geoJson
  const [state, setState] = useState({ key: 'firstAll', geoJson: undefined });
  // Key used to prevent race condition
  const [key, setKey] = React.useState('firstAll');

  const [legendRange, setLegendRange] = React.useState([]);
  const [rangeValues, setRangeValues] = React.useState({ min: NaN, max: NaN });

  useEffect(() => {
    let currentKey =
      state.geoJson != undefined && Object.keys(state.geoJson.properties).includes(level1key) ? level1key : level0key;
    let tmp = state.geoJson === undefined ? featureLevel0 : getDrillDown(state.geoJson, featureLevel1, currentKey);

    // Getting the new data and the distribution of the values
    let [newData, minValue, maxValue] = bindDataToMap(data, tmp);

    // Saving the new polygon data and their value range
    setPolygonData(newData);
    setRangeValues({ min: minValue, max: maxValue });

    // Getting the new legend numbers
    let legendRange = !isNaN(minValue) && !isNaN(maxValue) ? getLegendRange(minValue, maxValue, listColors.length) : [];
    setLegendRange(legendRange);

    // Synchronizing the key with the state key to retrigger rendering
    setKey(state.key);
  }, [state]);

  // Getting the upper level Map
  const map = useMap();

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

  /**
   * For each polygon, we have a defined style that we want to apply
   * @param _feature : Features of the current polygon
   * @returns A style that will be applied to its polygon
   */
  const geoJSONStyle = (_feature) => {
    /**
     * A polygon has a fill color based on its value
     * @param weight value inside the polygon
     * @param legendRange List that is used to define the legend range
     * @param listColors List of colors in the palette
     * @returns color assigned to the polygon based on it's position in the legend
     */
    function getColor(weight, legendRange, listColors) {
      let index = legendRange.findIndex((number) => {
        return number >= weight;
      });
      return listColors.slice(index)[0];
    }
    let color = !isNaN(_feature.properties.neo_value)
      ? getColor(_feature.properties.neo_value, legendRange, listColors)
      : 'gray';
    let style = {
      color: '#1f2021',
      weight: 1,
      fillOpacity: 0.8,
      fillColor: color,
    };
    return style;
  };

  /**
   * Functional component for a button to reset the visualization
   * @returns button component binded to the current map
   */
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

  const resetButton = isDrillDownEnabled ? ResetButton() : <></>;

  /**
   * Creates Legend component
   * @param colors Color palette selected defined in the ReportSettings
   * @param legendRange List of numbers that will be used to define the legend buckets
   * @param dimensions dimensions object passed down from AreaMapChart
   * @returns Legend component
   */
  function Legend(colors, legendRange, dimensions) {
    return (
      <div
        className='info legend'
        style={{
          zIndex: 1001,
          position: 'absolute',
          bottom: 30,
          right: 30,
          minWidth: 110,
          maxWidth: 180,
          width: dimensions.width * 0.25,
        }}
      >
        <table>
          {legendRange.map((from, i, legendRange) => {
            let to = legendRange[i + 1];
            return (
              <tr>
                <td>
                  <i style={{ background: colors[i] }}> &nbsp; </i>
                </td>
                <td>
                  <p style={{ fontSize: 'small', margin: 0, marginTop: 2, overflow: 'hidden', height: 20 }}>
                    {''}
                    {abbreviateNumber(from, 2)}
                    {!isNaN(to) ? ` - ${abbreviateNumber(to, 2)}` : i > 0 ? '+' : ''}{' '}
                  </p>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }

  // Create a legend only if the values are ready
  const legend = !(isNaN(rangeValues.min) && isNaN(rangeValues.min)) ? (
    Legend(listColors, legendRange, dimensions)
  ) : (
    <></>
  );

  // We need data or synchronized keys to enable re-render
  if (polygonData.length == 0 || key !== state.key) {
    return <></>;
  }

  const geoJsonLayer = (
    <div>
      {isDrillDownEnabled && state.geoJson !== undefined ? resetButton : <></>}
      {isLegendEnabled ? legend : <></>}
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
