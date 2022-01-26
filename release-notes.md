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




