import {
  schemeAccent,
  schemeCategory10,
  schemeDark2,
  schemePaired,
  schemePastel1,
  schemePastel2,
  schemeSet1,
  schemeSet2,
  schemeSet3,
} from 'd3-scale-chromatic';

// Nivo custom scheme which is not in the d3-scale-chromatic library
const NIVO_CUSTOM_SCHEME = ['#E8C1A0', '#F47560', '#F1E15A', '#E8A838', '#61CDBB', '#97E3D5'];

const schemeMapping = {
  nivo: NIVO_CUSTOM_SCHEME,
  accent: schemeAccent,
  category10: schemeCategory10,
  dark2: schemeDark2,
  paired: schemePaired,
  pastel1: schemePastel1,
  pastel2: schemePastel2,
  set1: schemeSet1,
  set2: schemeSet2,
  set3: schemeSet3,
};

export const getD3ColorsByScheme = (scheme) => schemeMapping[scheme];
