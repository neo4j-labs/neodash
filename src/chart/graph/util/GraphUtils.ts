import { useCallback } from 'react';

export const drawDataURIOnCanvas = (node, strDataURI, canvas, defaultNodeSize) => {
  let img = new Image();
  let prop = defaultNodeSize * 6;
  img.src = strDataURI;
  canvas.drawImage(img, node.x - prop / 2, node.y - prop / 2, prop, prop);
};

/**
 * Handles an 'expand' action taken by the user clicking on a node in the graph.
 *  TODO - improve the logic here.
 */
export const handleExpand = useCallback((node, queryCallback, setExtraRecords) => {
  queryCallback(`MATCH (n)-[e]-(m) WHERE id(n) =${node.id} RETURN e,m`, {}, setExtraRecords);
}, []);
