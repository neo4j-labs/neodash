## NeoDash 2.4.4
This is a hotfix release fixing some breaking issues in the 2.4.3:
- Fixed number parsing using newer versions of the Neo4j driver. [811](https://github.com/neo4j-labs/neodash/pull/811)
- Reverted new connection handler for auto-renewed SSO sessions. [815](https://github.com/neo4j-labs/neodash/pull/815)
- Improved handling of parameters in form extension, resolved local state issues. [813](https://github.com/neo4j-labs/neodash/pull/813)
- Updated Role management extension to no longer execute queries in parallel, improved UX and error handling [813](https://github.com/neo4j-labs/neodash/pull/813)

If you are currently using NeoDash version 2.4.3, we recommend updating as soon as possible.