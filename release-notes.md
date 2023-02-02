## NeoDash 2.2.2
The NeoDash 2.2.2 release is packed with a bunch of new usuability features:
- Changed the built-in Cypher editor to a brand-new [CodeMirror Editor](https://github.com/neo4j-contrib/cypher-editor).
- Rebuilt the **Parameter Select** component from scratch for improved stability, performance and extendability:
  - Added an optional setting to the parameter selector to display a different property from the one that is set by the selector.
  - Use this to - for example - let users choose a name and set an ID for use by other reports.
  - Fields no longer reset randomly when parameters are changed.
  - Freetext fields are no longer slow - perform as fast as the other selectors.
- Extended the [Example Gallery](https://neodash-gallery.graphapp.io/) with several new demos.
- Adding intermediate report error boundaries for improved app stability. 
- Changed docker image name to `neo4jlabs/neodash`.
- Improved documementation for developers.
- Fixed inconsistent styling between different pop-up screens, and fixed report title placeholders.