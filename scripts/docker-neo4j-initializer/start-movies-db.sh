echo "Loading Dataset"
cat ./scripts/docker-neo4j-initializer/movies.cypher | docker exec --interactive neo4j bin/cypher-shell -u neo4j -p test
echo "MATCH () RETURN count(*)" | docker exec --interactive neo4j bin/cypher-shell -u neo4j -p test