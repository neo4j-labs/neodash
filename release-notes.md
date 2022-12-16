## NeoDash 2.2.1
This update provides a number of usability improves over the 2.2.0 release.
In addition, it entails various improvements to the codebase, including security patches on the dependencies.

Table:
- Column names prefixed with `__` are now hidden in the table view.
  
Map:
- Added documentation for adding a custom map provider.

Parameter selector:
- Added support for boolean parameters.

Editor:
- Parameters are now automatically replaced **inside report titles**.
- Image downloads now include the report title alongside the visualization.

Others:
- Applied security patches for dependencies.
- Set test container for release pipeline to fixed version of Neo4j.
- Aligned code style / linting with Neo4j product standards.
- Updated Docker setup to inject `standaloneDashboardURL` into the application config.