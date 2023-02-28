import { Direction, recomputeCurvatures } from './RelUtils';

export const handleExpand = (id: number, type: string, direction: Direction) => {
  throw `Not Implemented${id}${type}${direction}`;

  /**
   * 
   // Fallback for when apoc is missing
    PROFILE MATCH (b:Brewery)
    WITH b LIMIT 1
    MATCH (b)-[r]-()
    RETURN type(r) as type, CASE WHEN startNode(r) = b THEN "out" ELSE "in" END as direction,  COUNT(r) as count

   */
  /**
   * 
    // Optimized neighbour detection (apoc needed)
    MATCH (b:Brewery)
    WITH b, apoc.node.relationship.types(b) as types
    UNWIND types as type
    WITH type, apoc.node.degree.in(b,type) as in, apoc.node.degree.out(b,type) AS out
    UNWIND ["in", "out"] as direction
    WITH type, direction, in, out
    WHERE (in <> 0 AND direction = "in") OR (out <> 0 AND direction = "out")
    RETURN type, direction, CASE WHEN direction = "in" THEN in ELSE out END
   */
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
    `MATCH (n), (m) WHERE id(n) = $start AND id(m) = $end CREATE (n)-[r:${type}]->(m) SET r = $properties`,
    {
      start: start.id,
      type: type,
      properties: properties,
      end: end.id,
    },
    (records) => {
      if (records && records[0] && records[0].error) {
        interactivity.createNotification('Error', records[0].error);
        return;
      }

      // Clean up properties for displaying in the visualization. This has to do with the visualization using 'name' as an override label.
      Object.keys(properties).map((prop) => {
        if (prop == 'name') {
          properties[' name'] = properties[prop];
          delete properties[prop];
        }
      });

      const {links} = data;
      links.push({
        id: -1,
        width: 2,
        color: 'grey',
        type: type,
        new: true,
        properties: properties,
        source: start,
        target: end,
      });

      // Recompute curvature for all links, because a new link was added.
      data.setLinks(recomputeCurvatures(links));
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
