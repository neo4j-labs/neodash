import { Direction } from './RelUtils';

export const drawDataURIOnCanvas = (node, strDataURI, canvas, defaultNodeSize) => {
  let img = new Image();
  let prop = defaultNodeSize * 6;
  img.src = strDataURI;
  canvas.drawImage(img, node.x - prop / 2, node.y - prop / 2, prop, prop);
};

export const handleExpand = (id: number, type: string, direction: Direction) => {
  throw `Not Implemented${  id  }${type  }${direction}`;
};

export const handleNodeCreate = () => {
  throw 'Not Implemented';
};

export const handleNodeEdit = () => {
  throw 'Not Implemented';
};

export const handleNodeDelete = () => {
  throw 'Not Implemented';
};

export const handleRelationshipCreate = (start, type, properties, end, engine, interactivity, data) => {
  engine.queryCallback(
    `MATCH (n), (m) WHERE id(n) = $start AND id(m) = $end CREATE (n)-[r:${  type  }]->(m) SET r = $properties`,
    {
      start: start,
      type: type,
      properties: properties,
      end: end,
    },
    (records) => {
      if (records && records[0] && records[0].error) {
        interactivity.createNotification('Error', records[0].error);
        return;
      }

      // Clean up properties for displaying in the visualization.
      Object.keys(properties).map((prop) => {
        if (prop == 'name') {
          properties[' name'] = properties[prop];
          delete properties[prop];
        }
      });

      data.appendLink({
        id: -1,
        width: 2,
        color: 'grey',
        type: type,
        new: true,
        properties: properties,
        source: start,
        target: end,
      });
      interactivity.createNotification('Relationship Created', 'The new relationship was added successfully.');
      interactivity.setContextMenuOpen(false);
    }
  );
};

export const handleRelationshipEdit = () => {
  throw 'Not Implemented';
};

export const handleRelationshipDelete = () => {
  throw 'Not Implemented';
};
