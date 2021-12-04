## NeoDash 2.0 (stable)

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




