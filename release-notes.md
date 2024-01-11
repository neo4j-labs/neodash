## NeoDash 2.4.1
This is a patch release following 2.4.0. It contains several new features for self-hosted (standalone) NeoDash deployments, as well as a variety of UX improvements for dashboard editors.


Included:
- Improvements to customizability of the bar chart (styling, legend customization, report actions). [#689](https://github.com/neo4j-labs/neodash/pull/689)
- Improved dashboard settings interface, fixed alignment for table download button. [#729](https://github.com/neo4j-labs/neodash/pull/729)
- Adjusted ordering of suggested labels/properties for parameter selectors. [#728](https://github.com/neo4j-labs/neodash/pull/728)
- Better handling of date parameters when saving/loading dashboards. [#727](https://github.com/neo4j-labs/neodash/pull/727)
- Fixed incorrect z-index issue for form creation modals. [#726](https://github.com/neo4j-labs/neodash/pull/726)
- Adjusted filtering tooltip on tables to avoid hiding result data. [#712](https://github.com/neo4j-labs/neodash/pull/712)
- Fixed uncontrolled component issue for dashboard import modal. [#711](https://github.com/neo4j-labs/neodash/pull/711)
- Adjusted font color of graph context popups to use theme colors. [#699](https://github.com/neo4j-labs/neodash/pull/699)
- Adjust sidebar database selector to only show active databases. [#698](https://github.com/neo4j-labs/neodash/pull/698)
- Incorporated logging functionality for self-hosted NeoDash deployments. [#705](https://github.com/neo4j-labs/neodash/pull/705)
- Improved dashboard management in standalone-mode deployments. [#705](https://github.com/neo4j-labs/neodash/pull/705)
- Added Docker parameter for overriding the app's logo & custom header.  [#705](https://github.com/neo4j-labs/neodash/pull/705)
- Changed the dashboard 'save' action to a logical merge, rather than a delete + create, allowing to persist labels across saves. [#705](https://github.com/neo4j-labs/neodash/pull/705)
- Docker: Updated Alpine base image to mitigate CVE-2023-38039 & CVE-2023-4863. [#705](https://github.com/neo4j-labs/neodash/pull/705)

