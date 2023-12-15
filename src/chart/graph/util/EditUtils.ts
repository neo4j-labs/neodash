import { GraphChartVisualizationProps, Link, Node } from '../GraphChartVisualization';
import { injectNewRecordsIntoGraphVisualization } from './RecordUtils';
import { recomputeCurvatures } from './RelUtils';

export const handleNodeCreate = () => {
  throw 'Not Implemented';
};

export const handleNodeEdit = (
  node: Node,
  labels: string[],
  properties: Record<string, any>,
  props: GraphChartVisualizationProps
) => {
  // Cast properties to numbers if they are castable as such...
  Object.keys(properties).forEach((key) => {
    const value = properties[key];
    if (!Number.isNaN(parseFloat(value))) {
      properties[key] = parseFloat(value);
    }
  });

  const oldLabels = node.labels.join(':');
  const newLabels = labels.join(':');

  props.engine.queryCallback(
    `MATCH (n) WHERE id(n) = $id REMOVE n:${oldLabels} SET n:${newLabels} SET n = $properties RETURN n`,
    {
      id: node.id,
      properties: properties,
    },
    (records) => {
      if (records && records[0] && records[0].error) {
        props.interactivity.createNotification('Error', records[0].error);
        return;
      }
      // const updatedNode = records[0]._fields[0];
      const { nodes, links, nodesMap, linksMap } = injectNewRecordsIntoGraphVisualization(records, props);
      const newNodes = [...props.data.nodes];

      // Iterate over the old nodes, and override the nodes object if it was changed.
      newNodes.forEach((n, i) => {
        nodes
          .filter((x) => x.id == n.id)
          .forEach((match) => {
            newNodes[i].labels = match.labels;
            newNodes[i].mainLabel = match.mainLabel;
            newNodes[i].color = match.color;
            newNodes[i].size = match.size;
            newNodes[i].properties = match.properties;
          });
      });
      props.data.setNodes(newNodes);
      props.interactivity.createNotification('Node Updated', 'The node details were updated successfully.');
    }
  );
};

export const handleNodeDelete = () => {
  throw 'Not Implemented';
};

export const handleRelationshipCreate = (
  start: Node,
  type: string,
  properties: Record<string, any>,
  end: Node,
  engine,
  interactivity,
  data
) => {
  engine.queryCallback(
    `MATCH (n), (m) WHERE id(n) = $start AND id(m) = $end CREATE (n)-[r:${type}]->(m) SET r = $properties RETURN r`,
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

      const id = records[0]._fields[0].identity;

      // Clean up properties for displaying in the visualization. This has to do with the visualization using 'name' as an override label.
      Object.keys(properties).map((prop) => {
        if (prop == 'name') {
          properties[' name'] = properties[prop];
          delete properties[prop];
        }
      });

      const { links } = data;
      links.push({
        id: id,
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

export const handleRelationshipEdit = (
  link: Link,
  properties: Record<string, any>,
  props: GraphChartVisualizationProps
) => {
  // Cast properties to numbers if they are castable as such...
  Object.keys(properties).forEach((key) => {
    const value = properties[key];
    if (!Number.isNaN(parseFloat(value))) {
      properties[key] = parseFloat(value);
    }
  });

  props.engine.queryCallback(
    `MATCH ()-[r]->()  WHERE id(r) = $id SET r = $properties RETURN r`,
    {
      id: link.id,
      properties: properties,
    },
    (records) => {
      if (records && records[0] && records[0].error) {
        props.interactivity.createNotification('Error', records[0].error);
        return;
      }

      const { nodes, links, nodesMap, linksMap } = injectNewRecordsIntoGraphVisualization(records, props);
      const newLinks = [...props.data.links];
      // Iterate over the old links, and override the links object if it was changed.
      newLinks.forEach((n, i) => {
        links
          .filter((x) => x.id == n.id)
          .forEach((match) => {
            newLinks[i].color = match.color;
            newLinks[i].width = match.width;
            newLinks[i].properties = match.properties;
          });
      });

      props.data.setLinks(newLinks);
      props.interactivity.createNotification(
        'Relationship Updated',
        'The relationship details were updated successfully.'
      );
    }
  );
};

export const handleRelationshipDelete = () => {
  throw 'Not Implemented';
};
