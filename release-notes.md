## NeoDash 2.3.1
What's new in NeoDash 2.3.1? A few bug fixes, improvement of natural language queries with support of Azure Open AI V1 and parameters, Graph Vizualization relationship styling and more below!

- Natural language queries
  - **Support of Azure Open AI V1** ([@BennuFire](https://github.com/bennufire), [#515](https://github.com/neo4j-labs/neodash/pull/515))
  - Support parameters on natural language queries ([@BennuFire](https://github.com/bennufire), [#514](https://github.com/neo4j-labs/neodash/pull/514))

- Graph Visualization
  - Added styling rules for relationship color ([@brahmprakashMishra](https://github.com/brahmprakashMishra) [@BennuFire](https://github.com/bennufire), [#537](https://github.com/neo4j-labs/neodash/pull/537))

- Table Chart
  - Update TableChart to use first returned row values as titles when transposed ([@bastienhubert](https://github.com/bastienhubert), [#513](https://github.com/neo4j-labs/neodash/pull/513))
  - Fix falsy boolean display on table ([@bastienhubert](https://github.com/bastienhubert), [#536](https://github.com/neo4j-labs/neodash/pull/536))

- Report Actions
  - Fix on Style and Action modal that was preventing from setting params on low resolutions ([@mariusconjeaud](https://github.com/mariusconjeaud), [#533](https://github.com/neo4j-labs/neodash/pull/533))

- Others
  - New setting for parameters selector to allow selection of multiple values instead of one + Fix multi selector on dates ([@BennuFire](https://github.com/bennufire), [#535](https://github.com/neo4j-labs/neodash/pull/535))
  - Fix bug where protocol was not set properly on share links ([@nielsdejong](https://github.com/nielsdejong), [#521](https://github.com/neo4j-labs/neodash/pull/521))
  - Update word-wrap from 1.2.3 to 1.2.4 ([@BennuFire](https://github.com/bennufire), [#526](https://github.com/neo4j-labs/neodash/pull/526) [#527](https://github.com/neo4j-labs/neodash/pull/527))
