import { GraphEntity } from '../GraphChartVisualization';

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
