import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { GraphLabel, TextLink } from '@neo4j-ndl/react';
import { withStyles } from '@mui/styles';
import {
  getRecordType,
  toNumber,
  valueIsArray,
  valueIsNode,
  valueIsPath,
  valueIsRelationship,
} from '../chart/ChartUtils';
// import DOMPurify from 'dompurify';

/**
 * Collects all node labels and node properties in a set of Neo4j records.
 * @param records : a list of Neo4j records.
 * @returns a list of lists, where each inner list is [NodeLabel] + [prop1, prop2, prop3]...
 */
export function extractNodePropertiesFromRecords(records: any) {
  const fieldsDict = {};
  records.forEach((record) => {
    record._fields.forEach((field) => {
      saveNodePropertiesToDictionary(field, fieldsDict);
    });
  });
  const fields = Object.keys(fieldsDict).map((label) => {
    return [label].concat(Object.values(fieldsDict[label]));
  });
  return fields.length > 0 ? fields : [];
}

/**
 * Collects all node labels and node properties in a set of Neo4j records.
 * @param records : a list of Neo4j records.
 * @returns a list of lists, where each inner list is [NodeLabel] + [prop1, prop2, prop3]...
 */
export function extractNodeAndRelPropertiesFromRecords(records: any) {
  const fieldsDict = {};
  records.forEach((record) => {
    record._fields.forEach((field) => {
      saveNodeAndRelPropertiesToDictionary(field, fieldsDict);
    });
  });
  const fields = Object.keys(fieldsDict).map((label) => {
    return [label].concat(Object.values(fieldsDict[label]));
  });
  return fields.length > 0 ? fields : [];
}

/**
 * Merges an existing set of fields (node labels and their properties) with a new one.
 * This is used when we explore the graph and want to update the report footer.
 * @param oldFields a list of string[].
 * @param newFields  a list of string[].
 * @returns a list of string[].
 */
export function mergeNodePropsFieldsLists(oldFields: any[], newFields: any[]) {
  const fields = [...oldFields];
  newFields.forEach((newEntry) => {
    const label = newEntry[0];
    const existingEntry = fields.filter((f) => f[0] == label)[0];
    if (!existingEntry) {
      fields.push(newEntry);
    } else {
      newEntry.slice(1).forEach((element) => {
        if (!element in existingEntry) {
          existingEntry.push(element);
        }
      });
    }
  });
  return fields;
}

export function saveNodePropertiesToDictionary(field, fieldsDict) {
  // TODO - instead of doing this discovery ad-hoc, we could also use CALL db.schema.nodeTypeProperties().
  if (field == undefined) {
    return;
  }
  if (valueIsArray(field)) {
    field.forEach((v) => saveNodePropertiesToDictionary(v, fieldsDict));
  } else if (valueIsNode(field)) {
    field.labels.forEach((l) => {
      fieldsDict[l] = fieldsDict[l]
        ? [...new Set(fieldsDict[l].concat(Object.keys(field.properties)))]
        : Object.keys(field.properties);
    });
  } else if (valueIsPath(field)) {
    field.segments.forEach((segment) => {
      saveNodePropertiesToDictionary(segment.start, fieldsDict);
      saveNodePropertiesToDictionary(segment.end, fieldsDict);
    });
  }
}

export function saveNodeAndRelPropertiesToDictionary(field, fieldsDict) {
  // TODO - instead of doing this discovery ad-hoc, we could also use CALL db.schema.nodeTypeProperties().
  if (field == undefined) {
    return;
  }
  if (valueIsArray(field)) {
    field.forEach((v) => saveNodeAndRelPropertiesToDictionary(v, fieldsDict));
  } else if (valueIsNode(field)) {
    field.labels.forEach((l) => {
      fieldsDict[l] = fieldsDict[l]
        ? [...new Set(fieldsDict[l].concat(Object.keys(field.properties)))]
        : Object.keys(field.properties);
    });
  } else if (valueIsRelationship(field)) {
    let l = field.type;
    fieldsDict[l] = fieldsDict[l]
      ? [...new Set(fieldsDict[l].concat(Object.keys(field.properties)))]
      : Object.keys(field.properties);
  } else if (valueIsPath(field)) {
    field.segments.forEach((segment) => {
      saveNodeAndRelPropertiesToDictionary(segment.start, fieldsDict);
      saveNodeAndRelPropertiesToDictionary(segment.end, fieldsDict);
    });
  }
}

/* HELPER FUNCTIONS FOR RENDERING A FIELD BASED ON TYPE */
const HtmlTooltip = withStyles(() => ({
  tooltip: {
    color: 'white',
    fontSize: 12,
    border: '1px solid #fcfffa',
  },
}))(Tooltip);

function addDirection(relationship, start) {
  relationship.direction = relationship.start.low == start.identity.low;
  return relationship;
}

const rightRelationship =
  'polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, 100% calc(100% - 50%), calc(100% - 10px) 100%, 0px 100%, 0% calc(100% - 0px), 0% 0px)';
const leftRelationship =
  'polygon(10px 0%, calc(100% - 0%) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 0%) 100%, 10px 100%, 0% calc(100% - 50%), 0% 50%)';

export function RenderNode(value, hoverable = true) {
  const chip = RenderNodeChip(value.labels.length > 0 ? value.labels.join(', ') : 'Node');
  if (!hoverable) {
    return chip;
  }
  return (
    <HtmlTooltip
      key={`${0}-${value.identity}`}
      arrow
      title={
        <div>
          <b> {value.labels.length > 0 ? value.labels.join(', ') : 'Node'}</b>
          <table>
            <tbody>
              {Object.keys(value.properties).length == 0 ? (
                <tr>
                  <td>(No properties)</td>
                </tr>
              ) : (
                Object.keys(value.properties)
                  .sort()
                  .map((k, i) => (
                    <tr key={i}>
                      <td key={0}>{k.toString()}:</td>
                      <td key={1}>{value.properties[k].toString()}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      }
    >
      {chip}
    </HtmlTooltip>
  );
}

export function RenderNodeChip(text, color = 'lightgrey', border = '0px') {
  return (
    <GraphLabel type='node' color={color} style={{ border: border }}>
      {text}
    </GraphLabel>
  );
}

export function RenderRelationshipChip(text, direction = undefined, color = 'lightgrey') {
  return (
    <Chip
      style={{
        background: color,
        borderRadius: 0,
        paddingRight: 5,
        height: 21,
        paddingLeft: 5,
        clipPath: direction == undefined ? 'none' : direction ? rightRelationship : leftRelationship,
      }}
      label={text}
    />
  );
}

function RenderRelationship(value, key = 0) {
  return (
    <HtmlTooltip
      key={`${key}-${value.identity}`}
      arrow
      title={
        <div>
          <b> {value.type}</b>
          <table>
            <tbody>
              {Object.keys(value.properties).length == 0 ? (
                <tr>
                  <td>(No properties)</td>
                </tr>
              ) : (
                Object.keys(value.properties)
                  .sort()
                  .map((k, i) => (
                    <tr key={i}>
                      <td key={0}>{k.toString()}:</td>
                      <td key={1}>{value.properties[k].toString()}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      }
    >
      {RenderRelationshipChip(value.type, value.direction)}
    </HtmlTooltip>
  );
}

function RenderPath(value) {
  return value.segments.map((segment, i) => {
    return RenderSubValue(
      i < value.segments.length - 1
        ? [segment.start, addDirection(segment.relationship, segment.start)]
        : [segment.start, addDirection(segment.relationship, segment.start), segment.end],
      i
    );
  });
}

/**
 * Renders an array of values.
 *
 * @param value - The array of values to render.
 * @param transposedTable - Optional. Specifies whether the table should be transposed. Default is false.
 * @returns The rendered array of values.
 */
function RenderArray(value, transposedTable = false) {
  let mapped = [];
  // If the first value is neither a Node nor a Relationship object
  // It is safe to assume that all values should be renedered as strings
  if (value.length > 0 && !valueIsNode(value[0]) && !valueIsRelationship(value[0])) {
    // If this request comes up from a transposed table
    // The returned value must be a single value, not an array
    // Otherwise, it will cast to [Object object], [Object object]
    if (transposedTable) {
      return RenderString(value.join(', '));
    }
    // Nominal case of a list of values renderable as strings
    // These should be joined by commas, and not inside <span> tags
    mapped = value.map((v, i) => {
      return RenderSubValue(v) + (i < value.length - 1 ? ', ' : '');
    });
  }
  // Render Node and Relationship objects, which will look like a Path
  mapped = value.map((v, i) => {
    return (
      <span key={String(`k${i}`) + v}>
        {RenderSubValue(v)}
        {i < value.length - 1 && !valueIsNode(v) && !valueIsRelationship(v) ? <span>, </span> : <></>}
      </span>
    );
  });
  return mapped;
}

function RenderString(value) {
  const str = value?.toString() || '';
  if (str.startsWith('http') || str.startsWith('https')) {
    return (
      <TextLink key={value} externalLink target='_blank' href={str}>
        {str}
      </TextLink>
    );
  }
  return str;
}

function RenderLink(value, disabled = false) {
  // If the link is embedded in a button (disabled), it's not a hyperlink, so we just return the string.
  if (disabled) {
    return value;
  }
  // Else, it's a 'real' link, and return a React object
  return (
    <TextLink key={value} externalLink target='_blank' href={value}>
      {value}
    </TextLink>
  );
}

function RenderPoint(value) {
  return (
    <HtmlTooltip
      key={value.toString()}
      title={
        <div>
          <b>
            Point x={value.x} y={value.y}
          </b>
        </div>
      }
    >
      <Chip label={'📍'} />
    </HtmlTooltip>
  );
}

function RenderInteger(value) {
  // if we cannot cast to integer, use the generic number renderer.
  if (!value || !value.toInt) {
    return RenderNumber(value);
  }
  const integer = value.toNumber().toLocaleString('en-US');
  return integer;
}

function RenderNumber(value) {
  if (value === null || !value.toLocaleString) {
    return 'null';
  }
  const number = value.toLocaleString('en-US');
  return number;
}

export function RenderSubValue(value, transposedTable = false) {
  if (value == undefined) {
    return '';
  }
  const type = getRecordType(value);
  const columnProperties = rendererForType[type];
  if (columnProperties) {
    if (columnProperties.renderValue) {
      return columnProperties.renderValue({ value: value, transposedTable: transposedTable });
    } else if (columnProperties.valueGetter) {
      return columnProperties.valueGetter({ value: value });
    }
  }

  return RenderString(value);
}

export const rendererForType: any = {
  node: {
    type: 'string',
    renderValue: (c) => RenderNode(c.value),
  },
  relationship: {
    type: 'string',
    renderValue: (c) => RenderRelationship(c.value),
  },
  path: {
    type: 'string',
    renderValue: (c) => RenderPath(c.value),
  },
  point: {
    type: 'string',
    renderValue: (c) => RenderPoint(c.value),
  },
  object: {
    type: 'string',
    // valueGetter enables sorting and filtering on string values inside the object
    valueGetter: (c) => {
      return JSON.stringify(c.value);
    },
    renderValue: (c) => {
      return JSON.stringify(c.value);
    },
  },
  array: {
    type: 'string',
    renderValue: (c) => RenderArray(c.value, c.transposedTable),
  },
  string: {
    type: 'string',
    renderValue: (c) => RenderString(c.value),
  },
  integer: {
    type: 'number',
    renderValue: (c) => RenderInteger(c.value),
  },
  number: {
    type: 'number',
    renderValue: (c) => RenderNumber(c.value),
  },
  objectNumber: {
    type: 'number',
    renderValue: (c) => RenderNumber(toNumber(c.value)),
  },
  null: {
    type: 'string',
    renderValue: (c) => RenderString(c.value),
  },
  undefined: {
    type: 'string',
    renderValue: (c) => RenderString(c.value),
  },
  boolean: {
    type: 'string',
    renderValue: (c) => RenderString(c.value),
  },
  link: {
    type: 'link',
    renderValue: (c, disabled = false) => RenderLink(c.value, disabled),
  },
};

export function getRendererForValue(value) {
  const type = getRecordType(value);
  return rendererForType[type] == null ? rendererForType.undefined : rendererForType[type];
}

export function renderValueByType(value) {
  const renderer = getRendererForValue(value);
  if (renderer) {
    return renderer.renderValue({ value: value });
  }
  return value.toString();
}
