import React, { useEffect } from 'react';
import { useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import nuts_rg_60m_2013_lvl_1 from '../nuts_rg_60m_2013_lvl_1.geo.json';
import nuts_rg_60m_2013_lvl_2 from '../nuts_rg_60m_2013_lvl_2.geo.json';
import Button from '@material-ui/core/Button';

const featureLevel1 = nuts_rg_60m_2013_lvl_1.features;
const featureLevel2 = nuts_rg_60m_2013_lvl_2.features;

export function CreateBoundaries(_data) {
  function getDrillDown(id, features) {
    return features.filter((x) => {
      return x.properties.NUTS_ID.startsWith(id);
    });
  }

  const [geoJson, setGeoJson] = React.useState(null);
  const geoJsonData = geoJson == null ? featureLevel1 : getDrillDown(geoJson.feature.properties.NUTS_ID, featureLevel2);
  const key = geoJson == null ? 'all' : geoJson.feature.properties.NUTS_ID;
  const map = useMap();

  function BootstrapButton() {
    const map = useMap();
    function onClick() {
      setGeoJson(null);
      map.setZoom(3.5);
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
    layer.on({
      click: onDrillDown,
    });
  }

  const geoJSONStyle = (_feature) => {
    return {
      color: '#1f2021',
      weight: 1,
      fillOpacity: 0.5,
      fillColor: getColor(Math.floor(Math.random() * 26)),
    };
  };
  // P
  const elem = BootstrapButton();
  console.log(key);
  console.log(geoJsonData);
  return (
    <div>
      {elem}
      <GeoJSON id='testAll' key={key} data={geoJsonData} style={geoJSONStyle} onEachFeature={onEachFeature}></GeoJSON>
    </div>
  );
}
