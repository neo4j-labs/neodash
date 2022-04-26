export const defaultCypherQuery = "MATCH (n) RETURN n LIMIT 25";
export const tableCypherQuery = "MATCH (n:Movie) RETURN n.title AS title, n.released AS released LIMIT 8";
export const barChartCypherQuery = "MATCH (n:Movie) RETURN n.released AS released, count(n.title) AS count LIMIT 5";