## NeoDash 2.1.8
New features:
- Added the [Dashboard Gallery](https://neodash-gallery.graphapp.io), a live gallery of example NeoDash dashboards.
- Added **Gauge Charts**, a contribution of the [BlueHound](https://github.com/zeronetworks/BlueHound) fork.
- Updated testing pipeline to work as an independent procedure.
- Added option to select a different Neo4j database for each report.
- Added **Report Actions**, a neodash extension (available in beta) only on [https://neodash.graphapp.io](https://neodash.graphapp.io).

Bug fixes:
- Fixed issue preventing dashboards to be shared with a non-standard database name.
- Fixed table chart breaking when returning a property called 'id' with a null value.
- Fixed bug not allowing users to select a different database when loading/saving a dashboard.


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


## NeoDash 2.1.4
Added hotfix for missing function in map visualization (https://github.com/neo4j-labs/neodash/issues/183).


## NeoDash 2.1.3
The 2.1.3 release contains updates to the map visualization, as well as a new Choropleth map report type.
Several usability improvements were also added, including fixing all links into the new documentation pages.

- Extended the map visualization with a heatmap mode & marker clustering.
- Added a Choropleth map visualization report type.
- Added support for auto-linking into a predefined database from https://tools.neo4jlabs.com/.
- Added optional background color setting for reports.
- Added a new 'resize mode' for page layout creation.
- Added support for drawing dates on a time chart (in addition to existing datetime types).
- Fixed broken links in the documentation portal, all in-app links now point to this portal as well.


## NeoDash 2.1.2
The 2.1.2 release contains some bug fixes and minor improvements to the application.

Application changes:
- Added button to clone (duplicate) a report inside a dashboard.
- Added option to show/hide labels inside circle packing charts.
- Changed dashboard layout compaction strategy to be more natural.
- Fixed card headers not rendering correctly in read-only mode.
- Fixed rendering issues for table columns containing null values.

Operational changes:
- Added support for username/password environment variables in Docker.


## NeoDash 2.1.0, NeoDash 2.1.1
The 2.1 release is a major update to the NeoDash application.

Main updates:
- Added new drag-and-drop dashboard layout - reports can be **moved** and **resized** freely within the dashboard.
- Updated dashboard file format for new layout (2.0 dashboards are automatically migrated).
- Pages can now be reordered by dragging and dropping. 
- Added three new hierarchical report types:
  - Treemaps
  - Sunburst Charts
  - Circle Packing Charts
- Styling/usability improvements for pie charts.
- Improved image download (screenshot functionality) for all report types.
- Parameter select reports now resize the selector to fit the available space.

Other changes:
- Added continuous integration and deployment workflows.
- Created a new [User Guide](https://github.com/neo4j-labs/neodash/wiki/User-Guide) with documentation on all report customizations is available.
- Added a new [Developer Guide](https://github.com/neo4j-labs/neodash/wiki/Developer-Guide) with info on installing, building and extending the application.


## NeoDash 2.0.15
This is the final minor update before the 2.1 release.

Changes:
- Several stability improvements before the 2.1 release.
- Updated Dockerfile to make better use of caching, and pick up environment variables at run time.
- Added option to replace dashboard parameters in Markdown/iFrames to make them dynamic.
- Removed unneeded index column from the CSV download for tables.
- Added optional dashboard setting to enable image downloads for reports/the entire dashboard.


## NeoDash 2.0.14
Report features:
- Added optional "Download as CSV" button to table reports.
- Dashboard parameters can now be used in iFrames/Graph drilldown links, and they are automatically replaced when parameters get updated.
- Updating a dashboard parameter now only refreshes the reports that use the parameter.

Standalone mode:
- Enabled deploying standalone dashboards with a direct URL to the dashboard.
- Added functionality to deep link into a NeoDash dashboard with dashboard parameters (use ?neodash_variable_name=value in the URL).


Miscellaneous Bug fixes and improvements:
- Resolved crash caused by invalid geospatial properties in a Map visualization.
- Saving a dashboard now lets users override an existing dashboard with the same name (enabled by default).
- Increased the default row limits for line/bar/pie charts to 250. Added option to override the row limiter in the dashboard settings.
- Updated project README file to refer to the correct port number on Docker deployments.
- Enabled a configurable timeout for parameter selection reports, both a timeout for the suggestion retrieval and a timeout for updating the parameters.
- Fixed dependency issues when installing the application on Windows systems. Bumped suggested npm version to 8.6.

## NeoDash 2.0.13
This is a bug fix/minor usability update.

Changes:
- Resolved error where the float value 0.0 was rendered as 'null' in tables.
- Added alphabetical sorting to all node/relationship inspection pop-ups & parameter select reports.
- Resolved bug where switching pages quickly resulting in an error message.
- Resolved bug where rule-based styling would break on null values.
- Replaced margin-based styling on single value reports with a vertical alignment option.

## NeoDash 2.0.12
Added **rule-based styling**:
- Use the card settings to specify styling rules for tables, graphs, bar/pie/line charts and single values.
- Conditional rules are evaluated on each report render in order of priority.
- Rules can customize colors in tables, node colors & dynamically set the colors of components in your chart.

Minor improvements:
- Better handling of null values in tables.
- Tweaking/reorganization of the Docker file and deployment scripts.
- Renaming/restructuring of source code.

## NeoDash 2.0.8 / 2.0.9 / 2.0.10 / 2.0.11
Stability fixes to supplement 2.0.7:
- Hotfix for missing config file in Neo4j Desktop causing startup issue.
- Hotfix for application crashes caused by rendering custom data types in transposed table views.
- Hotfix for object rendering in tables & line-chart type detection.
- Fix for rendering dictionaries in tables/single value charts.
- Added resize handler for fullscreen map views.
- Added missing auto-run config to pie charts.
- Fixed broken value scale parameter for bar charts.

## NeoDash 2.0.7
Application functionality:
- Added standalone 'dashboard viewer' mode.
- Added option to save/load dashboards from other Neo4j databases.

Reports/Visualizations:
- Fixed bug in creating line charts.
- Added support for datetime axis in line charts.
- Added auto-locale formatting to number values in single value / table reports.
- Added unified renderer for value types.
- Updated default font size for single value reports.
- Added optional deep-link button for graph visualizations.
- Added option to disable auto-running a report, to let users explore the query first.
- Minor styling tweaks to the graph views.

For Developers:
- Added more documentation on extending the app.
- New security-vetted docker image available on Docker hub.


## NeoDash 2.0.6
Major version updates to all internal dependencies. 
NeoDash 2.0.6 uses Node 17+, react 17+ and recent versions of all visualization libraries.

Visualizations:
- Added pie charts (Including examples and new demo dashboard).
- Added setting to transpose table rows and columns.
- Improved styling on graph pop-up windows.
- Graph visualizations now auto-fit to the report size.
- Added button to reset the zoom on a graph report.

Parameter selection:
- Added relationship property / free text selection options.

Editor:
- Improved performance of inbuilt Cypher editor.
- Added button to maximize cards while in edit-mode.
- All reports are now maximizable by default.
- Added tiny report sizes.
- Added option to override the default query timeout of twenty seconds.

Other:
- Updated docker image build scripts.
- Fixed share link geneneration incorrectly removing capitals from usernames/passwords.

## NeoDash 2.0.5
Graph report:
- Fixed node position after dragging nodes.
- Added option to 'lock' graph views, storing the current positions of the nodes in the graph.
- Added experimental graph layouts.

Table:
- Fixed bug where the report freezes for very wide tables.
- Added support for rendering native/custom Neo4j types in the table.

Parameter select:
- Fixed issue where the dashboard crashes for slow connections.

Editor:
- Added button to create a debug file from the 'About' screen.


## NeoDash 2.0.4
New features:
- Added option dashboard setting to let users view reports in a fullscreen pop-up.
- Added inspection pop-up for graph visualizations.
- Added option to manually specify node labels/property names in parameter selection reports (for large databases).
- Added example of how to user map visualizations from derived properties.
- Added button to return to the welcome screen.
- iFrames can now take live parameter selections in the hash-part of the URL.

Bug fixes:
- Dashboards will now remember the active selection(s) made in parameter select reports.
- Graph visualizations will no longer draw overlapping lines when a pair of nodes shares bidirectional relationships.
- connection screen is now dismissable if an existing connection exists.
    
Special thanks to @JipSogeti for their contributions to this release.

## NeoDash 2.0.3
UX improvements + bug fixes.
- Parameter selection report:
    - fixed bug to allow for selecting properties from nodes with >5 distinct properties.
    - Added support for nodes and properties with spaces in their name.
- Sharing:
    - Removed persisted URL in share links to avoid getting stuck on shared dashboards
- Table:
    - Added option to specify relative column sizes
- Graph:
    - Changed node styling to use the last (most specific label) for applying customizations
    - Fixed error where incorrect properties were extracted from graphs with multi-labeled nodes
    - Fixed node display to hide "undefined" when a non-existing property is selected for that node.
    
## NeoDash 2.0.0, 2.0.1 & 2.0.2

**New & Improved Dashboard Editor**
- Added new Cypher editor with syntax highlighting / live syntax validation.
- Redesigned Cypher query runner to be 2x more performant.
- Easy custom styling of reports with the "advanced report settings" window.
- Added in-built documentation with example queries and visualizations.
- Updated dashboard layout to better use screen real estate.

**Visualizations**
- Table View
    - New table view with post-query sorting and filtering, and highlighting of native Neo4j types.
    - Fixed array property display in table reports.
    - Added automatic link generation from URL properties in the table report.
- Graph View
    - Updated graph visualization library to a canvas-based renderer, handling 4x larger graphs.
    - Added custom node/relationship styling with custom colors, width, and font-size.
    - Better property display on graph visualization hover.
- Bar/Line Chart
    - New bar/line chart visualizations based on the Charts graph app.
    - Added support for multi-line charts, stacked/grouped bar charts.
    - Added log scale + explicit limit setting to bar/line charts.
    - Line chart hover values are no longer rounded and incorrectly stacked.
- Map View
    - Added custom styling options to map visualizations.
    - Added dictionary-based point property rendering on maps.
    - Stability improvement of map views for offline deployments.
- Single Value Report
    - Improved single value report.
    - Custom styling (text alignment) of single value reports.
- Property Selection:
    - Improved property selection documentation.
    - Added optional "clear parameter" setting to parameter selection report.
    - property selector now uses the filter to gather more results.

**Saving, loading and sharing**
- Added setting to turn entire dashboard into 'Standalone mode' from a share link.
- Added option to save/load dashboards from both files and text.
- New "Try a demo" button on the welcome screen.
- added save/load to Neo4j database feature.
- Auto-convert older versions of NeoDash on load.



