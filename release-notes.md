## NeoDash 2.1.8 & 2.1.9
New features:
- Added the [Dashboard Gallery](https://neodash-gallery.graphapp.io), a live gallery of example NeoDash dashboards.
- Added **Gauge Charts**, a contribution of the [BlueHound](https://github.com/zeronetworks/BlueHound) fork.
- Updated testing pipeline to work as an independent procedure.
- Added option to select a different Neo4j database for each report. ([#188](https://github.com/neo4j-labs/neodash/issues/118))
- Added **Report Actions**, a neodash extension (available in beta) only on [https://neodash.graphapp.io](https://neodash.graphapp.io). ([#27](https://github.com/neo4j-labs/neodash/issues/27))
 
Bug fixes:
- Fixed issue preventing dashboards to be shared with a non-standard database name.
- Fixed table chart breaking when returning a property called 'id' with a null value.
- Fixed bug not allowing users to select a different database when loading/saving a dashboard.
- **Added error handler for database list race condition in Neo4j Desktop**.

For a complete version history, see the [Changelog](https://github.com/neo4j-labs/neodash/blob/master/changelog.md).
