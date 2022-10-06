## NeoDash 2.1.6 & 2.1.7
New features:
- Added *Radar Charts/Spider Charts*.
- Added optional markdown description for each report, to be displayed via the header.

Extensions:
- Added option to provide a custom map provider for map charts.
- Added support for default values in parameter selectors.
- Added documentation on deep-linking into NeoDash.
- Added tick-rotation customization for line charts.
- Added option to have children in the sunburst chart inherit colors from their parents.

Improvements:
- Rewiring of the internal query/rendering engine - resulting in far fewer query executions and a smoother UX.
- Changed package manager from `npm` to `yarn`, and bumped node version to 18. Cleaned up `package.json`.
- Reduced flaky behaviour in parameter selectors.
- Added cycle-detection logic for sankey charts.
- Fixed report documentation pop-up to open link in a new window.
  
For a complete version history, see the [Changelog](https://github.com/neo4j-labs/neodash/blob/master/changelog.md).
