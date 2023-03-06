import { GraphChartVisualizationProps } from '../GraphChartVisualization';
import { injectNewRecordsIntoGraphVisualization } from './RecordUtils';
import { recomputeCurvatures } from './RelUtils';

export const getNodeRelationshipCountsQuery = `MATCH (b)
WHERE id(b) = $id
WITH b, apoc.node.relationship.types(b) as types
UNWIND types as type
WITH type, apoc.node.degree.in(b,type) as in, apoc.node.degree.out(b,type) AS out
UNWIND ["in", "out","any"] as direction
WITH type, direction, in, out
WHERE (in <> 0 AND direction = "in") OR (out <> 0 AND direction = "out") OR direction="any"
RETURN type, direction, 
    CASE WHEN direction = "in" THEN in 
         WHEN direction = "out" THEN out
        ELSE in+out END as value
ORDER BY type, direction
`;

export const getNodeRelationshipCountsQueryWithoutApoc = `
MATCH (b)
WHERE id(b) = $id
MATCH (b)-[r]-()
WITH type(r) as type, CASE WHEN startNode(r) = b THEN "out" ELSE "in" END as dir, COUNT(*) as value
UNWIND ["in", "out","any"] as direction
WITH *
WHERE (direction = dir) OR direction="any"
RETURN type, direction, sum(value) as value
ORDER BY type, direction
`;

export const handleGetNodeRelTypes = (id: number, engine: any, callback: any) => {
  engine.queryCallback(getNodeRelationshipCountsQuery, { id: id }, (records) => {
    if (records && records[0] && records[0].error) {
      handleGetNodeRelTypesWithoutApoc(id, engine, callback);
    } else {
      callback(records);
    }
  });
};

const handleGetNodeRelTypesWithoutApoc = (id: number, engine: any, callback: any) => {
  engine.queryCallback(getNodeRelationshipCountsQueryWithoutApoc, { id: id }, (records) => {
    callback(records);
  });
};

export const handleExpand = (id: number, type: string, dir: string, props: GraphChartVisualizationProps) => {
  const query = `
    MATCH (n)
    WHERE id(n) = $id 
    MATCH (n)${dir == 'in' ? '<' : ''}-[r${type !== '...' ? `:\`${type}\`` : ''}]-${dir == 'out' ? '>' : ''}(m)
    RETURN n, r, m
    `;

  props.engine.queryCallback(query, { id: id }, (records) => {
    if (records && records[0] && records[0].error) {
      props.interactivity.createNotification('Error', records[0].error);
      return;
    }
    const { nodes, links, nodesMap, linksMap } = injectNewRecordsIntoGraphVisualization(records, props);

    const newNodes = [...props.data.nodes];
    nodes.forEach((n) => {
      if (nodesMap[n.id] === undefined) {
        nodesMap[n.id] = n; // do not double push
        newNodes.push(n);
      }
    });

    const newLinks = [...props.data.links];
    links.forEach((n) => {
      if (linksMap[n.id] === undefined) {
        if (n.target.id === undefined) {
          n.target = nodesMap[n.target];
        }
        if (n.source.id === undefined) {
          n.source = nodesMap[n.source];
        }
        linksMap[n.id] = n; // do not double push
        newLinks.push(n);
      }
    });
    props.data.setGraph(newNodes, recomputeCurvatures(newLinks));
    props.engine.setCooldownTicks(50);
  });
};

// Combines the database statistic on relationship frequencies with those in the current view.
export const mergeDatabaseStatCountsWithCountsInView = (id, stats, links) => {
  const directions = ['out', 'in', 'any'];
  const mergedRelCounts = {};
  directions.map((d) => {
    mergedRelCounts[`...` + `___${d}`] = 0;
  });
  stats.forEach((item) => {
    const entry = `${item._fields[0]}___${item._fields[1]}`;
    if (mergedRelCounts[entry] === undefined) {
      mergedRelCounts[entry] = 0;
    }
    mergedRelCounts[entry] += parseInt(item._fields[2]);
    mergedRelCounts[`...` + `___${item._fields[1]}`] += parseInt(item._fields[2]);
  });
  // Subtract if we find links in the view that are already visible...
  links.forEach((item) => {
    if (item.source.id == id) {
      mergedRelCounts[`${item.type}___` + `out`] -= 1;
      mergedRelCounts[`${item.type}___` + `any`] -= 1;
      mergedRelCounts['...' + '___' + 'out'] -= 1;
      mergedRelCounts['...' + '___' + 'any'] -= 1;
    }
    if (item.target.id == id) {
      mergedRelCounts[`${item.type}___` + `in`] -= 1;
      mergedRelCounts[`${item.type}___` + `any`] -= 1;
      mergedRelCounts['...' + '___' + 'in'] -= 1;
      mergedRelCounts['...' + '___' + 'any'] -= 1;
    }
  });
  const mergedCountsList = Object.keys(mergedRelCounts).map((key) => {
    const [type, direction] = key.split('___');
    const value = mergedRelCounts[key];
    if (value !== 0) {
      return [type, direction, value];
    }
    return undefined;
  });
  return mergedCountsList.filter((v) => v !== undefined);
};
