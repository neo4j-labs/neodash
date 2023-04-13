import React, { useState, useEffect } from 'react';
import { ChartProps } from '../../../../chart/Chart';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapBoundary } from './PolygonLayer';
import { recordToNative } from '../../../../chart/ChartUtils';
import { NoDrawableDataErrorMessage } from '../../../../component/editor/CodeViewerComponent';
import { keyLengthToKeyName, regionCodeName } from './constants';

/**
 * Method used to extract geographic data from the records got back by the query
 * @param records List of records returned from the query
 * @param selection Selection defined by the user to map the query result to the map
 * @returns Dictionary that assigns, to each geoCode, its value
 */
function createGeoDictionary(records, selection) {
  let data = {};

  records.forEach((row: Record<string, any>) => {
    try {
      const index = recordToNative(row.get(selection.index));
      const value = recordToNative(row.get(selection.value));
      if (!index || value == undefined || isNaN(value) || typeof index !== 'string') {
        return;
        // throw "Invalid selection for area map chart. Ensure a three letter country code is retrieved together with a value."
      }
      data[index] = value;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  });
  return data;
}
/**
 * To speed up the binding process, let's reduce the list into a object to use the index access
 * @param features
 * @param desiredLevel
 * @returns
 */
function fromFeatureListToObject(features, desiredLevel) {
  let res = {};
  features.forEach((feature) => {
    let code = feature.properties[desiredLevel];
    if (code != undefined) {
      res[code] = feature;
    }
  });
  return res;
}
/**
 * Renders Neo4j Records inside a GeoJSON map.
 */
const NeoAreaMapChart = (props: ChartProps) => {
  // Retrieve config from advanced settings
  const { records } = props;
  const { selection } = props;
  const dimensions = props.dimensions ? props.dimensions : { width: 100, height: 100 };
  const keyLength = props.settings && props.settings.countryCodeFormat ? props.settings.countryCodeFormat : 'Alpha-2';
  let key = `${dimensions.width},${dimensions.height},${props.fullscreen}`;
  const [data, setData] = useState({});
  // Two feature levels (ideally we can even more)
  const [featureLevel0, setFeatureLevel0] = useState({});
  const [featureLevel1, setFeatureLevel1] = useState({});
  const [isReady, setIsReady] = useState(false);
  const mapProviderURL =
    props.settings && props.settings.providerUrl
      ? props.settings.providerUrl
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const attribution =
    props.settings && props.settings.attribution
      ? props.settings.attribution
      : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

  // Extracting the geoData from the records
  useEffect(() => {
    setData(createGeoDictionary(records, selection));
  }, [records, selection]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/neo4j-labs/neodash-static/main/world_polymap_level_0_entities.json')
      .then((res) => res.json())
      .then((matched) => {
        let tmp = fromFeatureListToObject(matched.features, keyLengthToKeyName[keyLength]);
        setFeatureLevel0(tmp);
        setIsReady(true);
      });
  }, [keyLength]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/neo4j-labs/neodash-static/main/world_polymap_level_1_entities.json')
      .then((res) => res.json())
      .then((matched) => {
        let tmp = fromFeatureListToObject(matched.features, regionCodeName);
        setFeatureLevel1(tmp);
      });
  }, []);

  if (
    Object.keys(data).length == 0 ||
    !selection ||
    selection.index == selection.value ||
    props.records == null ||
    props.records.length == 0 ||
    props.records[0].keys == null
  ) {
    return <NoDrawableDataErrorMessage />;
  }

  // Rendering the map only when all the data is ready
  if (isReady) {
    return (
      <MapContainer
        key={key}
        style={{ width: '100%', height: '100%' }}
        center={[0, 0]}
        zoom={0.5}
        maxZoom={18}
        scrollWheelZoom={false}
      >
        <TileLayer attribution={attribution} url={mapProviderURL} />
        {
          <MapBoundary
            data={data}
            props={props}
            featureLevel0={featureLevel0}
            featureLevel1={featureLevel1}
            dimensions={dimensions}
          />
        }
      </MapContainer>
    );
  }
  return <></>;
};

export default NeoAreaMapChart;
