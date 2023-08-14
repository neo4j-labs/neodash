## NeoDash 2.3.2
What's new in NeoDash 2.3.2? A few bug fixes, performance improvements and more important, it ships phase 2 of our migration to [Needle](https://neo4j.com/developer-blog/needle-neo4j-design-system/)  !

- Key Features:
  - UI updated to use the **[Neo4j Design Language](https://www.neo4j.design/)** phase 2, giving NeoDash a similar look-and-feel to other Neo4j tools. This includes the removal of the sidebar and a complete refactor on the header component. ([@mariusconjeaud](https://github.com/mariusconjeaud),[@konsalex](https://github.com/konsalex),[@BennuFire](https://github.com/bennufire), [#552](https://github.com/neo4j-labs/neodash/pull/552))
  - *Experimental* Support for **Dark Mode**. 
- Parameter Selector Chart
  - New advanced setting 'Manual Parameter Save' allowing  dashboard parameters propagation on demand (instead of automatically on change) ([@BennuFire](https://github.com/bennufire), [#545](https://github.com/neo4j-labs/neodash/pull/545))
  - Fix delete button leading to inconsistent values on click. ([@BennuFire](https://github.com/bennufire), [#545](https://github.com/neo4j-labs/neodash/pull/545))


- Others
  - Fix performance degradation on schema calculation ([@BennuFire](https://github.com/bennufire), [#555](https://github.com/neo4j-labs/neodash/pull/555))
  - Fix standalone bug that prevent user from using username and password fields([@BennuFire](https://github.com/bennufire), [#551](https://github.com/neo4j-labs/neodash/pull/551))
  - Added Sentry Support on https://neodash.graphapp.io ([@mariusconjeaud](https://github.com/mariusconjeaud), [#546](https://github.com/neo4j-labs/neodash/pull/546))
  - Fix SSO redirection on editor mode ([@BennuFire](https://github.com/bennufire), [#543](https://github.com/neo4j-labs/neodash/pull/543))
