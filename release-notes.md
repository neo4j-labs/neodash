## NeoDash 2.1.5
Added *New* Sankey charts:
- Visualize nodes and relationships as a flow diagram.
- Select a customizable flow value from relationship properties.
- Configure a variety of style customizations.

Parameter select:
- Fixed bug where values would randomly be deleted after changing the parameter.
- Added option to customize the number of suggested values when a user enters (part of) a property value.
- Added option to customize search type (CONTAINS, STARTS WITH, or ENDS WITH).
- Added option to enable/disable case-sensitive search.
- Added option to enable/disable removing duplicate suggestions.

Miscellaneous:
- Extended documentation with examples on running NeoDash in Kubernetes.
- Fixed issue where duplicate database names were visible when running NeoDash on an on-prem Neo4j cluster.