## NeoDash 2.2.4

- Graph Visualization
  - Added lightweight, ad-hoc graph exploration by relationship type and direction. (@nielsdejong, #123)
  - Added experimental graph editing - editing nodes and relationships, plus creating relationships between existing nodes. (@nielsdejong, #123)
  - Fixed incorrect assignment of chip colors in graph visualization footer. (@BennuFire , [#296](https://github.com/neo4j-labs/neodash/issues/296))
  - Added experimental CSV download button to graph visualizations ([@JonanOribe](https://github.com/JonanOribe), [#288](https://github.com/neo4j-labs/neodash/issues/288), [#363](https://github.com/neo4j-labs/neodash/issues/363))
  - Fixed bug where dashboard parameters were not dynamically injected into drilldown links for the graph visualization.  (@nielsdejong, [#123](https://github.com/neo4j-labs/neodash/pull/410))
  - Added setting to customize the size of the arrow head. Set to zero to disable directional rendering. (@BennuFire)

- Single Value Chart
  - Added support for outputting dictionaries in YML format, and visualizing newlines. (@nielsdejong, #123)

- Area Map (@alfredorubin, #123)
  - Added a new advanced chart interactive area map visualization for rendering geojson polygons.
  - Assign color scale automatically based on numeric values.
  - For countries we support Alpha-2 and Alpha-3 codes, area codes rendered by ISO 3166 code.
  - Drilldown by clicking on countries region.

- Choropleth Map
  - Added polygon information for missing countries: France, Kosovo, and others. (@BennuFire, [#357](https://github.com/neo4j-labs/neodash/issues/357))

- Parameter Selector
  - Fixed bug where parameter selector was not using selected database to populate results. (@BennuFire, [#366])
  - Added date picker parameter selector. (@alfredorubin, #123)
  - Added support for injecting custom queries as a populator for parameter selectors. (@BennuFire, [#236](https://github.com/neo4j-labs/neodash/issues/236), [#369](https://github.com/neo4j-labs/neodash/issues/369))

- Table
  - Added support for customizing the seperator in export CSV. (@alfredorubin, #123)

- Others
  - Added support for easy configurable branding/color schemes (@jharris4, #123)
  - Added a new report action to switch pages (@BennuFire)
  - Added handler for mulitple report actions to be executed on the same event (@jharris4, #123)
  - Integrated the official release Cypher editor component (@jharris4, #123)
  - Fixed hot-module replacement inside webpack config  (@konsalex, #123)
  - Fixed husky pre-commit hook not triggering correctly on Windows environments (bastienhubert, #123)


