## NeoDash 2.2.5
This is a minor release with some small bug fixes, directly following the 2.2.4 release.
- Fixed replacement rules for parameters in iFrames/Markdown reports. [#17](https://github.com/neo4j-labs/neodash/pull/417)
- Added automatic header text color switch for reports with a dark background [#420](https://github.com/neo4j-labs/neodash/pull/420)
- Fixed handling right click events (for graph exploration) in Neo4j Desktop [#415](https://github.com/neo4j-labs/neodash/pull/415).
- Added support for unweighted Sankey charts [#419](https://github.com/neo4j-labs/neodash/pull/419)


## NeoDash 2.2.4
This release is a feature-rich package with a variety of new features and bug fixes. NeoDash 2.2.4 features new visualizations, as well as new features in existing visualization components. 


- Area Map - **New!** 
  - Added a new advanced chart interactive area map visualization for rendering geo json polygons. ([@alfredorubin96](https://github.com/alfredorubin96), [#401](https://github.com/neo4j-labs/neodash/pull/401))
  - Assign color scale automatically based on numeric values.
  - Assign colors to countries based on Alpha-2 and Alpha-3 codes, and area codes by ISO 3166 code.
  - Interactive drilldown by clicking on regions in a country.

- Graph Visualization
  - Added **lightweight, ad-hoc graph exploration** by relationship type and direction. ([@nielsdejong](https://github.com/nielsdejong), [#401](https://github.com/neo4j-labs/neodash/pull/401))
  - Added experimental graph editing: nodes and relationships, plus creating relationships between existing nodes. ([@nielsdejong](https://github.com/nielsdejong), [#401](https://github.com/neo4j-labs/neodash/pull/401))
  - Fixed incorrect assignment of chip colors in graph visualization footer. ([@BennuFire](https://github.com/bennufire), [#296](https://github.com/neo4j-labs/neodash/issues/296))
  - Added experimental CSV download button to graph visualizations. ([@JonanOribe](https://github.com/JonanOribe), [#288](https://github.com/neo4j-labs/neodash/issues/288), [#363](https://github.com/neo4j-labs/neodash/issues/363))
  - Fixed a bug where dashboard parameters were not dynamically injected into drilldown links. ([@nielsdejong](https://github.com/nielsdejong), [#397](https://github.com/neo4j-labs/neodash/pull/397))
  - Added setting to customize the size of the arrow head on an edge. Set to zero to disable directional rendering. ([@BennuFire](https://github.com/bennufire), [#410](https://github.com/neo4j-labs/neodash/pull/410))
 
- Single Value Chart
  - Added support for outputting dictionaries in YML format, and rendering new lines. ([@nielsdejong](https://github.com/nielsdejong), [#315](https://github.com/neo4j-labs/neodash/issues/315))

- Choropleth Map
  - Added polygon information for missing countries: France, Kosovo, and others. ([@BennuFire](https://github.com/bennufire), [#357](https://github.com/neo4j-labs/neodash/issues/357))

- Parameter Selector
  - Fixed bug where the parameter selector was not using the selected database to populate results. ([@BennuFire](https://github.com/bennufire), [#366](https://github.com/neo4j-labs/neodash/issues/366))
  - Added a date picker parameter selector type for natively specifying dates. ([@alfredorubin96](https://github.com/alfredorubin96), [#401](https://github.com/neo4j-labs/neodash/pull/401))
  - Added support for injecting custom queries as a populator for parameter selector suggestions. ([@BennuFire](https://github.com/bennufire), [#236](https://github.com/neo4j-labs/neodash/issues/236), [#369](https://github.com/neo4j-labs/neodash/issues/369))

- Table Chart
  - Added support for customizing the seperator in csv exports. ([@nielsdejong](https://github.com/nielsdejong), [#337](https://github.com/neo4j-labs/neodash/issues/337))
- Others
  - Added support for easily configurable branding/color schemes of the editor. ([@nielsdejong](https://github.com/nielsdejong), [#401](https://github.com/neo4j-labs/neodash/pull/401))
  - Added a new report action to switch pages based on a user interaction. ([@BennuFire](https://github.com/BennuFire), [#324](https://github.com/neo4j-labs/neodash/issues/324))
  - Added handler for mulitple report actions to be executed on the same event. ([@BennuFire](https://github.com/BennuFire), [#324](https://github.com/neo4j-labs/neodash/issues/324))
  - Integrated the official released version of the Neo4j Cypher editor component. ([@jharris4](https://github.com/jharris4), [#365](https://github.com/neo4j-labs/neodash/pull/365))
  - Fixed hot-module replacement inside webpack configuration.  ([@konsalex](https://github.com/konsalex), [#396](https://github.com/neo4j-labs/neodash/pull/396))
  - Fixed husky pre-commit hook not triggering correctly on Windows environments. ([@bastienhubert](https://github.com/bastienhubert), [#342](https://github.com/neo4j-labs/neodash/issues/342))
  - Add support for using complex objects in markdown, iframes and report titles. ([@BennuFire](https://github.com/bennufire), [#413](https://github.com/neo4j-labs/neodash/pull/413))


## NeoDash 2.2.3
This releases fixes a small set of bugs that slipped through the 2.2.3 release, and adds some minor features:
- Added support for scatter plots by overriding a parameter in the line chart.
- Added the ability to use dashboard parameter as filters in custom parameter selector queries.
- Fixed breaking bug in parameter selector settings causing a white-screen error.
- Fixed auto-coloring of bar charts (resolved back to logic of 2.2.1 and earlier).
- Added a quick fix for automatically resetting the parameter display value when the property display override is toggled.
- Upversioned outdated dashboards and in the NeoDash Gallery.

  
## NeoDash 2.2.2
The NeoDash 2.2.2 release is packed with a bunch of new usability features:
- Changed the built-in Cypher editor to a brand-new [CodeMirror Editor](https://github.com/neo4j-contrib/cypher-editor).
- Rebuilt the **Parameter Select** component from scratch for improved stability, performance and extendability:
  - Added an optional setting to the parameter selector to display a different property from the one that is set by the selector.
  - Use this to - for example - let users choose a name and set an ID for use by other reports.
  - Fields no longer reset randomly when parameters are changed.
  - Freetext fields are no longer slow - perform as fast as the other selectors.
- Add the option to use rule-based styling based on dashboard parameters.
- Changed rule-based styling on bar and pie charts to override color scheme instead of clear the scheme.
- Extended the [Example Gallery](https://neodash-gallery.graphapp.io/) with several new demos.
- Adding intermediate report error boundaries for improved app stability. 
- Changed docker image name to `neo4jlabs/neodash`.
- Improved documementation for developers.
- Fixed inconsistent styling between different pop-up screens, and fixed report title placeholders.

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

## NeoDash 2.2.0
This release marks the official arrival of **[Extensions](https://neo4j.com/labs/neodash/2.2/user-guide/extensions/)**, which provide a simple way of extending NeoDash with additional features. Adding your own features to NeoDash just became a lot easier!

NeoDash 2.2 comes with three in-built extensions.
- **Rule-Based Styling**
- **Advanced Visualizations**: These provide a means to enable complex visualizations in a dashboard. These were previously available as Radar charts, Treemaps, Circle Packing reports, Sankey charts, Choropleth and a Gauge Chart).
- **Report Actions**: Which let you create interactivity in dashboards, using the output of one report as input for another visualization. (Pro Extension)

You can enable extensions by clicking the 🧩 icon on the left sidebar of the screen.

Other changes include:
- New example dashboards available in the [Dashboard Gallery](https://neodash-gallery.graphapp.io).
- Customizable background colors for all report types.
- Fixing a bug where the Choropleth map chart was unable to parse country-codes.

## NeoDash 2.1.10
This is a minor update which adds some operational/styling improvements, and a bug fix for line charts.

Changes:
- Added customizable label positions for bar charts.
- Fixed bug where datetimes were not handled correctly by line charts. (https://github.com/neo4j-labs/neodash/issues/243)
- Added **session parameters**, set automatically and available to Cypher queries ([Documentation](https://neo4j.com/labs/neodash/2.1/user-guide/reports/)).
- Added option to restore debug reports in recovery mode.
- Added option to share dashboards from self-hosted deployments.

## NeoDash 2.1.8 & 2.1.9
New features:
- Added the [Dashboard Gallery](https://neodash-gallery.graphapp.io), a live gallery of example NeoDash dashboards.
- Added **Gauge Charts**, a contribution of the [BlueHound](https://github.com/zeronetworks/BlueHound) fork.
- Updated testing pipeline to work as an independent procedure.
- Added option to select a different Neo4j database for each report. ([#188](https://github.com/neo4j-labs/neodash/issues/118))
- Added **Report Actions**, a neodash extension (available in beta) only on [https://neodash.graphapp.io](https://neodash.graphapp.io). ([#27](https://github.com/neo4j-labs/neodash/issues/27))
 
Bug fixes:
- Fixed issue preventing dashboards to be shared with a non-standard database name.
- Fixed table chart breaking when returning a property called 'id' with a null value.
- Fixed bug not allowing users to select a different database when loading/saving a dashboard.
- **Added error handler for database list race condition in Neo4j Desktop**.


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



