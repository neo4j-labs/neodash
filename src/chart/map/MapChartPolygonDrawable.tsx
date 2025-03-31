import React, { useState } from 'react';
import 'leaflet-draw/dist/leaflet.draw.css';

import NeoMapChart from './MapChart';
import { ChartProps } from '../Chart';
import GeomanDrawingLayer from './layers/GeomanDrawingLayer';

const NeoMapChartWithPolygons: React.FC<ChartProps> = (props) => {
  // State to track drawn polygons
  const [filterPolygonCoordinates, setFilterPolygonCoordinates] = useState<any>(null);
  const [onResetFn, setOnResetFn] = useState<(() => void)>(() => false); // when user has drawn a polygon,
  // they can reset it which removes their drawing and shows everything again. This function handles that.

  // Children prop would work too but I want this to be explicit
  return (
    <>
      <NeoMapChart
        {...props}
        additionalRenderElement={
        <div>
          <div hidden={filterPolygonCoordinates === null}
               style={{position: "fixed", bottom:"95px", zIndex:"9999", right:"15px", backgroundColor: "white",
                 padding: "5px", borderRadius: "4px", border: "2px solid rgba(0,0,0,0.4)"}}
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

export default NeoMapChartWithPolygons;