import domtoimage from 'dom-to-image';

/**
 * Converts a neo4j record entry to a readable string representation.
 */
export const convertRecordObjectToString = (entry) => {
  if (entry == null || entry == undefined) {
    return entry;
  }
  const className = entry.__proto__.constructor.name;
  if (className == 'String') {
    return entry;
  } else if (valueIsNode(entry)) {
    return convertNodeToString(entry);
  } else if (valueIsRelationship(entry)) {
    return convertRelationshipToString(entry);
  } else if (valueIsPath(entry)) {
    return convertPathToString(entry);
  }
  return entry.toString();
};

/**
 * Converts a neo4j node record entry to a readable string representation.
 * if it's a fieldType =="Node"
 * Then, return
 * 1. 'name' property, if it exists,
 * 2. the 'title' property, if it exists,
 * 3. the 'id' property, if it exists...
 * 4. the 'uid' property, if it exists..
 * 5. the ({labels}}, if they exist,
 * 6. Node(id).
 */
const convertNodeToString = (nodeEntry) => {
  if (nodeEntry.properties.name) {
    return `${nodeEntry.labels}(${nodeEntry.properties.name})`;
  }
  if (nodeEntry.properties.title) {
    return `${nodeEntry.labels}(${nodeEntry.properties.title})`;
  }
  if (nodeEntry.properties.id) {
    return `${nodeEntry.labels}(${nodeEntry.properties.id})`;
  }
  if (nodeEntry.properties.uid) {
    return `${nodeEntry.labels}(${nodeEntry.properties.uid})`;
  }
  return `${nodeEntry.labels}(` + `_id=${nodeEntry.identity})`;
};

// if it's a fieldType == "Relationship"
const convertRelationshipToString = (relEntry) => {
  return relEntry.toString();
};

// if it's a fieldType == "Path"
const convertPathToString = (pathEntry) => {
  return pathEntry.toString();
};
// Anything else, return the string representation of the object.

/* HELPER FUNCTIONS FOR DETERMINING TYPE OF FIELD RETURNED FROM NEO4J */
export function valueIsArray(value) {
  const className = value.__proto__.constructor.name;
  return className == 'Array';
}

export function valueIsNode(value) {
  // const className = value.__proto__.constructor.name;
  // return className == "Node";
  return value && value.labels && value.identity && value.properties;
}

export function valueIsRelationship(value) {
  // const className = value.__proto__.constructor.name;
  // return className == "Relationship";
  return value && value.type && value.start && value.end && value.identity && value.properties;
}

export function valueIsPath(value) {
  // const className = value.__proto__.constructor.name;
  // return className == "Path"
  return value && value.start && value.end && value.segments && value.length;
}

export function valueisPoint(value) {
  // Look at the properties and identify the type.
  return value && value.x && value.y && value.srid;
}

export function valueIsObject(value) {
  // TODO - this will not work in production builds. Need alternative.
  const className = value.__proto__.constructor.name;
  return className == 'Object';
}

export function getRecordType(value) {
  // mui data-grid native column types are: 'string' (default),
  // 'number', 'date', 'dateTime', 'boolean' and 'singleSelect'
  // https://v4.mui.com/components/data-grid/columns/#column-types
  // Type singleSelect is not implemented here
  if (value === true || value === false) {
    return 'boolean';
  } else if (value === undefined) {
    return 'undefined';
  } else if (value === null) {
    return 'null';
  } else if (value.__isInteger__) {
    return 'integer';
  } else if (typeof value == 'number') {
    return 'number';
  } else if (value.__isDate__) {
    return 'date';
  } else if (value.__isDateTime__) {
    return 'dateTime';
  } else if (valueIsNode(value)) {
    return 'node';
  } else if (valueIsRelationship(value)) {
    return 'relationship';
  } else if (valueIsPath(value)) {
    return 'path';
  } else if (valueIsArray(value)) {
    return 'array';
  } else if (valueIsObject(value)) {
    return 'object';
  }

  // Use string as default type
  return 'string';
}

/**
 * Basic function to convert a table row output to a CSV file, and download it.
 * TODO: Make this more robust. Probably the commas should be escaped to ensure the CSV is always valid.
 */
export const downloadCSV = (rows) => {
  const element = document.createElement('a');
  let csv = '';
  const headers = Object.keys(rows[0]).slice(1);
  csv += `${headers.join(', ')}\n`;
  rows.forEach((row) => {
    headers.forEach((header) => {
      // Parse value
      let value = row[header];
      if (value && value.low) {
        value = value.low;
      }
      csv += JSON.stringify(value).replaceAll(',', ';');
      csv += headers.indexOf(header) < headers.length - 1 ? ', ' : '';
    });
    csv += '\n';
  });

  const file = new Blob([csv], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = 'table.csv';
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
};

/**
 * Replaces all global dashboard parameters inside a string with their values.
 * @param str The string to replace the parameters in.
 * @param parameters The parameters to replace.
 */
export function replaceDashboardParameters(str, parameters) {
  if (!str) {
    return '';
  }
  Object.keys(parameters).forEach((key) => {
    str = str.replaceAll(`$${key}`, parameters[key] !== null ? parameters[key] : '');
  });
  return str;
}

/**
 * Downloads a screenshot of the element reference passed to it.
 * @param ref The reference to the element to download as an image.
 */
export const downloadComponentAsImage = (ref) => {
  const element = ref.current;

  domtoimage.toPng(element, { bgcolor: 'white' }).then((dataUrl) => {
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = dataUrl;
    link.click();
  });
};

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
        ', ',
      )}.  The expected keys are: ${keys.join(', ')}`,
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

/**
 * Converts a list of Neo4j records into a hierarchy structure for hierarchical data visualizations.
 */
export const processHierarchyFromRecords = (records: Record<string, any>[], selection: any) => {
  return records.reduce((data: Record<string, any>, row: Record<string, any>) => {
    try {
      // const index = recordToNative(row.get('index'));
      // const key = recordToNative(row.get('key'));
      // const value = recordToNative(row.get('value'));

      const index = recordToNative(row.get(selection.index));
      // const idx = data.findIndex(item => item.index === index)
      // const key = selection['key'] !== "(none)" ? recordToNative(row.get(selection['key'])) : selection['value'];
      const value = recordToNative(row.get(selection.value));
      if (!Array.isArray(index) || isNaN(value)) {
        throw 'Invalid data format selected for hierarchy report.';
      }
      let holder = data;
      for (let [idx, val] of index.entries()) {
        // Add a level prefix to each item to avoid duplicates
        val = `lvl${idx}_${val}`;
        const obj = search(holder, val, 'name');
        const entry = { name: val };
        if (obj) {
          holder = obj;
        } else {
          if (Array.isArray(holder)) {
            holder.push(entry);
            // eslint-disable-next-line no-prototype-builtins
          } else if (holder.hasOwnProperty('children')) {
            holder.children.push(entry);
          } else {
            holder.children = [entry];
          }

          holder = search(holder, val, 'name');
        }
      }
      holder.loc = value;
      return data;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return [];
    }
  }, []);
};
