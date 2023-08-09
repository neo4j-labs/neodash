export enum Direction {
  Incoming,
  Outgoing,
}
const update = (state, mutations) => Object.assign({}, state, mutations);

/**
 * Assigns a computed curvature value to a link in the visualization.
 * @param link the link object (n)-[e]->(n2)
 * @param index the index of the link in the list between a pair of nodes.
 * @param nodePairListLength  the amount of links between (n) and (n2) in the same direction.
 * @param mirroredNodePairListLength the amount of links between (n) and (n2) in the opposite direction.
 * @returns the link with an assigned curvature value.
 */
export function assignCurvatureToLink(link, index, nodePairListLength, mirroredNodePairListLength) {
  if (link.source == link.target) {
    // Self-loop
    return update(link, { curvature: 0.4 + index / 8 });
  }
  // If we have edges from the target to the source, adjust curvatures accordingly.
  const totalRelsBetweenPair = nodePairListLength + mirroredNodePairListLength;
  return update(link, {
    curvature:
      link.source > link.target
        ? getCurvature(index, totalRelsBetweenPair)
        : -getCurvature(index + mirroredNodePairListLength, totalRelsBetweenPair),
  });
}

// Function to manually compute edge curvatures for dense node pairs.
export function getCurvature(index, total) {
  if (total <= 6) {
    // Precomputed edge curvatures for nodes with multiple edges in between.
    const curvatures = {
      0: 0,
      1: 0,
      2: [-0.5, 0.5], // 2 = Math.floor(1/2) + 1
      3: [-0.5, 0, 0.5], // 2 = Math.floor(3/2) + 1
      4: [-0.66666, -0.33333, 0.33333, 0.66666], // 3 = Math.floor(4/2) + 1
      5: [-0.66666, -0.33333, 0, 0.33333, 0.66666], // 3 = Math.floor(5/2) + 1
      6: [-0.75, -0.5, -0.25, 0.25, 0.5, 0.75], // 4 = Math.floor(6/2) + 1
      7: [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75], // 4 = Math.floor(7/2) + 1
    };
    return curvatures[total][index];
  }

  if (isNaN(total)) {
    return 0;
  }
  // @ts-ignore
  const arr1 = [...Array(Math.floor(total / 2)).keys()].map((i) => {
    return (i + 1) / (Math.floor(total / 2) + 1);
  });
  const arr2 = total % 2 == 1 ? [0] : [];
  // @ts-ignore
  const arr3 = [...Array(Math.floor(total / 2)).keys()].map((i) => {
    return (i + 1) / -(Math.floor(total / 2) + 1);
  });
  return arr1.concat(arr2).concat(arr3)[index];
}

export const selfLoopRotationDegrees = 45;

export const generateRelCanvasObject = (link: any, ctx: any, relLabelFontSize: any, relLabelColor: any) => {
  const label = link.properties.name || link.type || link.id;
  const fontSize = relLabelFontSize;
  const { source } = link;
  const { target } = link;
  ctx.font = `${fontSize}px Sans-Serif`;
  ctx.fillStyle = relLabelColor;
  if (link.target != link.source) {
    const lenX = target.x - source.x;
    const lenY = target.y - source.y;
    const posX = target.x - lenX / 2;
    const posY = target.y - lenY / 2;
    const length = Math.sqrt(lenX * lenX + lenY * lenY);
    const angle = Math.atan(lenY / lenX);
    ctx.save();
    ctx.translate(posX, posY);
    ctx.rotate(angle);
    // Mirrors the curvatures when the label is upside down.
    const mirror = link.source.x > link.target.x ? 1 : -1;
    ctx.textAlign = 'center';
    if (link.curvature) {
      ctx.fillText(label, 0, mirror * length * link.curvature * 0.5);
    } else {
      ctx.fillText(label, 0, 0);
    }
    ctx.restore();
  } else {
    ctx.save();
    ctx.translate(link.source.x, link.source.y);
    ctx.rotate((Math.PI * selfLoopRotationDegrees) / 180);
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, -18.7 + -37.1 * (link.curvature - 0.5));
    ctx.restore();
  }
};

/**
 * Recompute curvatures for all links in the visualization.
 * This is needed when new relationships are added by exploration or graph editing.
 * TODO - this could be optimized by caching a dictionary instead of transforming the list here...
 */
export function recomputeCurvatures(links) {
  const linksMap = {};
  links.forEach((link) => {
    if (linksMap[`${link.source.id},${link.target.id}`] == undefined) {
      linksMap[`${link.source.id},${link.target.id}`] = [];
    }
    linksMap[`${link.source.id},${link.target.id}`].push(link);
  });
  const linksList = Object.values(linksMap).map((linkArray) => {
    return linkArray.map((link, i) => {
      const mirroredNodePair = linksMap[`${link.target.id},${link.source.id}`];
      return assignCurvatureToLink(link, i, linkArray.length, mirroredNodePair ? mirroredNodePair.length : 0);
    });
  });
  return linksList.flat();
}

/**
 * Merges two lists of (potententially duplicate) links.
 */
export function mergeLinksLists(oldLinks, newLinks) {
  const links = {};
  oldLinks.forEach((link) => {
    links[link.id] = link;
  });
  newLinks.forEach((link) => {
    links[link.id] = link;
  });
  return Object.values(links);
}
