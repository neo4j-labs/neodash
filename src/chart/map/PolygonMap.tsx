import React, { useState, useEffect } from 'react';
import { ChartProps } from '../Chart';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapBoundary } from './layers/Polygons';
import { recordToNative } from '../../chart/ChartUtils';
import { NoDrawableDataErrorMessage } from '../../component/editor/CodeViewerComponent';

const ISO_3166_2_regex =
  '^(A(D|E|F|G|I|L|M|N|O|R|S|T|Q|U|W|X|Z)|B(A|B|D|E|F|G|H|I|J|L|M|N|O|R|S|T|V|W|Y|Z)|C(A|C|D|F|G|H|I|K|L|M|N|O|R|U|V|X|Y|Z)|D(E|J|K|M|O|Z)|E(C|E|G|H|R|S|T)|F(I|J|K|M|O|R)|G(A|B|D|E|F|G|H|I|L|M|N|P|Q|R|S|T|U|W|Y)|H(K|M|N|R|T|U)|I(D|E|Q|L|M|N|O|R|S|T)|J(E|M|O|P)|K(E|G|H|I|M|N|P|R|W|Y|Z)|L(A|B|C|I|K|R|S|T|U|V|Y)|M(A|C|D|E|F|G|H|K|L|M|N|O|Q|P|R|S|T|U|V|W|X|Y|Z)|N(A|C|E|F|G|I|L|O|P|R|U|Z)|OM|P(A|E|F|G|H|K|L|M|N|R|S|T|W|Y)|QA|R(E|O|S|U|W)|S(A|B|C|D|E|G|H|I|J|K|L|M|N|O|R|T|V|Y|Z)|T(C|D|F|G|H|J|K|L|M|N|O|R|T|V|W|Z)|U(A|G|M|S|Y|Z)|V(A|C|E|G|I|N|U)|W(F|S)|Y(E|T)|Z(A|M|W))$';

/**
 * Method used to extract geographic data from the records got back by the query
 * @param records List of records returned from the query
 * @param selection Selection defined by the user to map the query result to the map
 * @returns Dictionary that assigns, to each geoCode, its value
 */
function createGeoDictionary(records, selection) {
  let data = {};
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  records.forEach((row: Record<string, any>) => {
    try {
      const index = recordToNative(row.get(selection.index));
      const value = recordToNative(row.get(selection.value));
      if (
        !index ||
        value == undefined ||
        isNaN(value) ||
        typeof index !== 'string' ||
        String(index).match(ISO_3166_2_regex)?.length == 0
      ) {
        return;
        // throw "Invalid selection for choropleth chart. Ensure a three letter country code is retrieved together with a value."
      }
      // Getting min and max to generate styling according to value
      if (value < min || (min === Number.POSITIVE_INFINITY && value != undefined)) {
        min = value;
      }
      if (value > max || (max === Number.NEGATIVE_INFINITY && value != undefined)) {
        max = value;
      }
      data[index] = value;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  });

  // Normalizing values
  // try with this :  https://stackoverflow.com/questions/1069666/sorting-object-property-by-values
  // https://github.com/CodingWith-Adam/covid19-map

  return { data: data, min: min, max: max };
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
const NeoPolygonMapChart = (props: ChartProps) => {
  // Retrieve config from advanced settings
  const { records } = props;
  const { selection } = props;
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
        let tmp = fromFeatureListToObject(matched.features, 'SHORT_COUNTRY_CODE');
        setFeatureLevel0(tmp);
        setIsReady(true);
      });
  }, []);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/neo4j-labs/neodash-static/main/world_polymap_level_1_entities.json')
      .then((res) => res.json())
      .then((matched) => {
        let tmp = fromFeatureListToObject(matched.features, 'COMPOSITE_REGION_CODE');
        setFeatureLevel1(tmp);
      });
  }, []);

  if (
    Object.keys(data).length == 0 ||
    !selection ||
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
        key={`polygon_map${props.fullscreen}`}
        style={{ width: '100%', height: '100%' }}
        center={[0, 0]}
        zoom={0.5}
        maxZoom={18}
        scrollWheelZoom={false}
      >
        <TileLayer attribution={attribution} url={mapProviderURL} />
        {<MapBoundary data={data} props={props} featureLevel0={featureLevel0} featureLevel1={featureLevel1} />}
      </MapContainer>
    );
  }
  return <></>;
};

export default NeoPolygonMapChart;
