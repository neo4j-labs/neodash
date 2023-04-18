## NeoDash 2.2.4
This release is a feature-rich package with a variety of new features and bug fixes, featuring new visualization as well as extensions to existing visualization components. 



- Area Map - **New!** 
  - Added a new advanced chart interactive area map visualization for rendering geo json polygons. ([@alfredorubin96](https://github.com/alfredorubin96), [#401](https://github.com/neo4j-labs/neodash/pull/401))
  - Assign color scale automatically based on numeric values.
  - For countries we support Alpha-2 and Alpha-3 codes, area codes rendered by ISO 3166 code.
  - Interactivity drilldown by clicking on regions in a country.

- Graph Visualization
  - Added **lightweight, ad-hoc graph exploration** by relationship type and direction. ([@nielsdejong](https://github.com/nielsdejong), [#401](https://github.com/neo4j-labs/neodash/pull/401))
  - Added experimental graph editing: nodes and relationships, plus creating relationships between existing nodes. ([@nielsdejong](https://github.com/nielsdejong), [#401](https://github.com/neo4j-labs/neodash/pull/401))
  - Fixed incorrect assignment of chip colors in graph visualization footer. ([@BennuFire](https://github.com/bennufire), [#296](https://github.com/neo4j-labs/neodash/issues/296))
  - Added experimental CSV download button to graph visualizations ([@JonanOribe](https://github.com/JonanOribe), [#288](https://github.com/neo4j-labs/neodash/issues/288), [#363](https://github.com/neo4j-labs/neodash/issues/363))
  - Fixed bug where dashboard parameters were not dynamically injected into drilldown links. ([@nielsdejong](https://github.com/nielsdejong), [#397](https://github.com/neo4j-labs/neodash/pull/397))
  - Added setting to customize the size of the arrow head. Set to zero to disable directional rendering. ([@BennuFire](https://github.com/bennufire), [#410](https://github.com/neo4j-labs/neodash/pull/410))
 
- Single Value Chart
  - Added support for outputting dictionaries in YML format, and rendering new lines. ([@nielsdejong](https://github.com/nielsdejong), [#315](https://github.com/neo4j-labs/neodash/issues/315))



- Choropleth Map
  - Added polygon information for missing countries: France, Kosovo, and others. ([@BennuFire](https://github.com/bennufire), [#357](https://github.com/neo4j-labs/neodash/issues/357))

- Parameter Selector
  - Fixed bug where parameter selector was not using selected database to populate results. ([@BennuFire](https://github.com/bennufire), [#366](https://github.com/neo4j-labs/neodash/issues/366))
  - Added a date picker parameter selector type. ([@alfredorubin96](https://github.com/alfredorubin96), [#401](https://github.com/neo4j-labs/neodash/pull/401))
  - Added support for injecting custom queries as a populator for parameter selectors. ([@BennuFire](https://github.com/bennufire), [#236](https://github.com/neo4j-labs/neodash/issues/236), [#369](https://github.com/neo4j-labs/neodash/issues/369))

- Table Chart
  - Added support for customizing the seperator in csv exports. ([@nielsdejong](https://github.com/nielsdejong), [#337](https://github.com/neo4j-labs/neodash/issues/337))
- Others
  - Added support for easy configurable branding/color schemes ([@nielsdejong](https://github.com/nielsdejong), [#401](https://github.com/neo4j-labs/neodash/pull/401))
  - Added a new report action to switch pages ([@BennuFire](https://github.com/BennuFire), [#324](https://github.com/neo4j-labs/neodash/issues/324))
  - Added handler for mulitple report actions to be executed on the same event ([@BennuFire](https://github.com/BennuFire), [#324](https://github.com/neo4j-labs/neodash/issues/324))
  - Integrated the official release Cypher editor component ([@jharris4](https://github.com/jharris4), [#365](https://github.com/neo4j-labs/neodash/pull/365))
  - Fixed hot-module replacement inside webpack config  ([@konsalex](https://github.com/konsalex), [#396](https://github.com/neo4j-labs/neodash/pull/396))
  - Fixed husky pre-commit hook not triggering correctly on Windows environments ([@bastienhubert](https://github.com/bastienhubert), [#342](https://github.com/neo4j-labs/neodash/issues/342))