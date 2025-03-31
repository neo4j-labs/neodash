import React, { useEffect, useState } from 'react';
import { FeatureGroup } from 'react-leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';

import NeoMapChart from './MapChart';
import { ChartProps } from '../Chart';
import GeomanDrawingLayer from './layers/GeomanDrawingLayer';

const polygonInputVariableKey = 'Input_PolygonsForMapQuery'

const NeoMapChartWithPolygons: React.FC<ChartProps> = (props) => {
  // State to track drawn polygons
  const [drawnPolygons, setDrawnPolygons] = useState<Array<Array<{lat: number, lng: number}>>>([]);
  const [filterPolygonCoordinates, setFilterPolygonCoordinates] = useState<any>(null);
  const [onResetFn, setOnResetFn] = useState<any>(null);

  useEffect(() => {
    console.log("New filter polygon coordinates!", filterPolygonCoordinates);
  }, [filterPolygonCoordinates])

  // @deprecated
  const handlePolygonCreated = (e) => {
    const layer = e.layer;
    const polygonCoords = layer.getLatLngs()[0].map(latlng => ({
      lat: latlng.lat,
      lng: latlng.lng
    }));

    // Update local state
    const newPolygons = [...drawnPolygons, polygonCoords];
    setDrawnPolygons(newPolygons);

    if (props.setGlobalParameter) {
      console.log('Have updated the polygons global dashboard state...', newPolygons);
      props.setGlobalParameter(polygonInputVariableKey, newPolygons);
    }
  };

  const handlePolygonDeleted = (e) => {
    const remainingPolygons = drawnPolygons.filter((_, index) =>
      !e.layers.getLayers().some((layer) =>
        layer.getLatLngs()[0].some(latlng =>
          drawnPolygons[index].some(p => p.lat === latlng.lat && p.lng === latlng.lng)
        )
      )
    );

    setDrawnPolygons(remainingPolygons);

    if (props.setGlobalParameter) {
      props.setGlobalParameter(polygonInputVariableKey, remainingPolygons);
    }
  };

  // Children prop would work too but I want this to be explicit
  return (
    <>
      <NeoMapChart
        {...props}
        additionalRenderElement={
        <div>
          <div hidden={filterPolygonCoordinates === null}
               style={{position: "fixed", bottom:"95px", zIndex:"9999", right:"15px", backgroundColor: "white", padding: "5px",
                 borderRadius: "4px", border: "2px solid rgba(0,0,0,0.4)"}}
               onClick={() => {
                 setFilterPolygonCoordinates(null)
                 onResetFn();
               }}>
            Reset Filter
          </div>
          <GeomanDrawingLayer setFilterPolygonCoordinates={setFilterPolygonCoordinates} setOnResetFn={setOnResetFn} />
        </div>
        }
        filterPolygonCoordinates={filterPolygonCoordinates}
      />
    </>
  );
};

/*
When react-leaflet-draw, this worked (as additionalRenderElement):
 <FeatureGroup>
            <EditControl
              position='topright'
              onCreated={handlePolygonCreated}
              onDeleted={handlePolygonDeleted}
              draw={{
                rectangle: false,
                circle: false,
                polyline: false,
                marker: false,
                circlemarker: false
              }}

            />
          </FeatureGroup>
 */

export default NeoMapChartWithPolygons;