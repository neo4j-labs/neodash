import { tokens } from '@neo4j-ndl/base';
import { QueryResult, Record as Neo4jRecord } from 'neo4j-driver';
export function recordToNative(input: any): any {
  if (!input && input !== false) {
    return null;
  } else if (typeof input.keys === 'object' && typeof input.get === 'function') {
    return Object.fromEntries(input.keys.map((key) => [key, recordToNative(input.get(key))]));
  } else if (typeof input.toNumber === 'function') {
    return input.toNumber();
  } else if (Array.isArray(input)) {
    return (input as Array<any>).map((item) => recordToNative(item));
  } else if (typeof input === 'object') {
    const converted = Object.entries(input).map(([key, value]) => [key, recordToNative(value)]);

    return Object.fromEntries(converted);
  }

  return input;
}

export function resultToNative(result: QueryResult): Record<string, any> {
  if (!result) {
    return {};
  }

  return result.records.map((row) => recordToNative(row));
}
export function checkResultKeys(first: Neo4jRecord, keys: string[]) {
  const missing = keys.filter((key) => !first.keys.includes(key));

  if (missing.length > 0) {
    return new Error(
      `The query is missing the following key${missing.length > 1 ? 's' : ''}: ${missing.join(
        ', '
      )}.  The expected keys are: ${keys.join(', ')}`
    );
  }

  return false;
}

/**
 * For hierarchical data structures, recursively search for a key property that must have a given value.
 * If none can be found, return null.
 */
export const search = (tree, value, key = 'id', reverse = false) => {
  if (tree.length == 0) {
    return null;
  }
  const stack = Array.isArray(tree) ? [...tree] : [tree];
  while (stack.length) {
    const node = stack[reverse ? 'pop' : 'shift']();
    if (node[key] && node[key] === value) {
      return node;
    }
    if (node.children) {
      stack.push(...node.children);
    }
  }
  return null;
};

/**
 * For hierarchical data, we remove all intermediate node prefixes generate by `processHierarchyFromRecords`.
 * This ensures that the visualization itself shows the 'real' names, and not the intermediate ones.
 */
export const mutateName = (currentNode) => {
  if (currentNode.name) {
    const s = currentNode.name.split('_');
    currentNode.name = s.length > 0 ? s.slice(1).join('_') : s[0];
  }

  if (currentNode.children) {
    currentNode.children.forEach((n) => mutateName(n));
  }
};

export const findObject = (data, name) => data.find((searchedName) => searchedName.name === name);

export const flatten = (data) =>
  data.reduce((acc, item) => {
    if (item.children) {
      return [...acc, item, ...flatten(item.children)];
    }
    return [...acc, item];
  }, []);

export const rgbaToHex = (color: string): string => {
  let rgba;
  if (/^rgb/.test(color)) {
    rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
  } else {
    rgba = color.split(',');
  }

  if (rgba) {
    // rgb to hex
    // eslint-disable-next-line no-bitwise
    let hex = `#${((1 << 24) + (parseInt(rgba[0], 10) << 16) + (parseInt(rgba[1], 10) << 8) + parseInt(rgba[2], 10))
      .toString(16)
      .slice(1)}`;

    // added alpha param if exists
    if (rgba[4]) {
      const alpha = Math.round(0o1 * 255);
      const hexAlpha = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();
      hex += hexAlpha;
    }

    return hex;
  }
  return color;
};

export enum EntityType {
  Node,
  Relationship,
}

export const themeNivo = {
  textColor: 'rgb(var(--palette-neutral-text-default))',
  text: { fill: 'rgb(var(--palette-neutral-text-default))' },
  axis: {
    ticks: { text: { fill: 'rgb(var(--palette-neutral-text-default))' } },
    legend: { text: { fill: 'rgb(var(--palette-neutral-text-default))' } },
  },
  legends: {
    text: { fill: 'rgb(var(--palette-neutral-text-default))' },
    title: { text: { fill: 'rgb(var(--palette-neutral-text-default))' } },
    ticks: { text: { fill: 'rgb(var(--palette-neutral-text-default))' } },
    hidden: { text: { fill: 'rgb(var(--palette-neutral-text-default))' } },
  },
  markers: {
    text: { fill: 'rgb(var(--palette-neutral-text-default))' },
  },
  labels: {
    text: { fill: 'rgb(var(--palette-neutral-text-default))' },
  },
  annotations: {
    text: { fill: 'rgb(var(--palette-neutral-text-default))' },
  },
  tooltip: {
    container: {
      fill: 'rgb(var(--palette-neutral-text-default))',
      background: 'rgb(var(--palette-neutral-bg-strong))',
    },
  },
};

export const themeNivoCanvas = (theme) => {
  let baseDefault =
    theme === 'light' ? tokens.palette.light.neutral.text.default : tokens.palette.dark.neutral.text.default;
  let baseWeak = theme === 'light' ? tokens.palette.light.neutral.text.weak : tokens.palette.dark.neutral.text.weak;
  return {
    // textColor: 'rgb(var(--palette-neutral-text-default))',
    text: { fill: baseDefault },
    axis: {
      ticks: { text: { fill: baseDefault } },
      legend: { text: { fill: baseDefault } },
    },
    legends: {
      text: { fill: baseWeak },
      title: { text: { fill: baseWeak } },
      ticks: { text: { fill: baseWeak } },
      hidden: { text: { fill: baseWeak } },
    },
    markers: {
      text: { fill: baseDefault },
    },
    labels: {
      text: { fill: baseDefault },
    },
    annotations: {
      text: { fill: baseDefault },
    },
    tooltip: {
      container: {
        fill: 'rgb(var(--palette-neutral-text-default))',
        background: 'rgb(var(--palette-neutral-bg-strong))',
      },
    },
  };
};
