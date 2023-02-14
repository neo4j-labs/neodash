import React from 'react';
import { useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import level1_who from '../level1_who.json';
import level2_who from '../level2_who.json';
import Button from '@material-ui/core/Button';

const featureLevel1 = level1_who.features;
const featureLevel2 = level2_who.features;

// Wraps the boundary logic function
export const MapBoundary = ({ _data, isDrillDownEnabled = false }) => {
  console.log('MapBoundary');
  console.log(isDrillDownEnabled);
  const boundary = CreateBoundaries(_data, isDrillDownEnabled);
  return boundary;
};

function CreateBoundaries(_data, isDrillDownEnabled) {
  function getDrillDown(id, features) {
    return features.filter((x) => {
      return x.properties.CODE_right === id;
    });
  }

  // Current selected geojson (needed for drill down)
  const [geoJson, setGeoJson] = React.useState(null);
  // Data that is going to be rendered in the Map
  const geoJsonData = geoJson == null ? featureLevel1 : getDrillDown(geoJson.feature.properties.CODE, featureLevel2);
  // Changing the key is fundamental to trigger re-render
  const key = geoJson == null ? 'all' : geoJson.feature.properties.CODE;
  const map = useMap();

  // Button to reset the view and the whole drilldown
  function ResetButton() {
    const map = useMap();
    function onClick() {
      setGeoJson(null);
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
    map.fitBounds(e.target.getBounds());
    setGeoJson(e.target);
  }

  function onEachFeature(_, layer) {
    if (isDrillDownEnabled) {
      layer.on({
        click: onDrillDown,
      });
    }
  }

  const geoJSONStyle = (_feature) => {
    return {
      color: '#1f2021',
      weight: 1,
      fillOpacity: 0.5,
      fillColor: getColor(Math.floor(Math.random() * 26)),
    };
  };

  const resetButton = ResetButton();
  return (
    <div>
      {resetButton}
      <GeoJSON id='testAll' key={key} data={geoJsonData} style={geoJSONStyle} onEachFeature={onEachFeature}></GeoJSON>
    </div>
  );
}

function getColor(d: number) {
  return d > 25
    ? '#800026'
    : d > 20
    ? '#E31A1C'
    : d > 15
    ? '#FD8D3C'
    : d > 10
    ? '#FEB24C'
    : d > 5
    ? '#FED976'
    : '#FFEDA0';
}
