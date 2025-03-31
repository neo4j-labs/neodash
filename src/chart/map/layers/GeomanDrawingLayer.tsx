import { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

export default ({setFilterPolygonCoordinates, setOnResetFn}) => {
  const context = useLeafletContext();

  useEffect(() => {
    const leafletContainer = context.layerContainer || context.map;

    leafletContainer.pm.addControls({
      drawMarker: false
    });

    leafletContainer.pm.setGlobalOptions({ pmIgnore: false });

    leafletContainer.on("pm:create", (e) => {
      // This triggers when the user finishes drawing (e.g. connects the last part of a polygon).
      // We can then use the layer to get the polygon points in a turf (polygon-fitlering-module compatible) format.

      // then we can either send the filtering through via props to the MarkerLayer or through dashboard state
      // I prefer sending them back up to MapChartPolygonDrawable then down to MarkerLayer in this circumstance, as it
      // does not need to be global and that is only one layer of prop drilling.

      if (e.layer) {
        const polygon = e.layer.toGeoJSON();
        const coordinates = polygon.geometry.coordinates;

        const swapCoordinates = (coords)=>  {
          if (Array.isArray(coords) && coords.length === 2 &&
            typeof coords[0] === 'number' && typeof coords[1] === 'number') {
            return [coords[1], coords[0]];
          }
          else if (Array.isArray(coords)) {
            return coords.map(coord => swapCoordinates(coord));
          }
          return [coords];
        }

        polygon.geometry.coordinates = swapCoordinates(coordinates);
        setFilterPolygonCoordinates(polygon);
        setOnResetFn(() => () => {
          leafletContainer.pm.addControls({
            drawMarker: false
          })
          console.log('Layer had properties: ', e.layer)
          e.layer.remove()
        }) // redisplay controls when they reset the board.
        console.log('Updated polygon coordinates with layer info VVV: ', polygon);
        leafletContainer.pm.removeControls();
        leafletContainer.pm.setGlobalOptions({ pmIgnore: true });

      }
    });

    leafletContainer.on("pm:remove", (e) => {
      // setFilterPolygonCoordinates(null)
      console.log("object removed");
      // console.log(leafletContainer.pm.getGeomanLayers(true).toGeoJSON());
    });

    return () => {
      leafletContainer.pm.removeControls();
      leafletContainer.pm.setGlobalOptions({ pmIgnore: true });
    };
  }, [context]);

  return null;
};
