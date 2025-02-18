## NeoDash 2.4.10 - Community contributions
This is a minor release containing bug fixes and improvements contributed by the NeoDash community.
- [#1039](https://github.com/neo4j-labs/neodash/pull/1039) - Fix default color scheme for bar charts
- [#1038](https://github.com/neo4j-labs/neodash/pull/1038) - Fix rule-based styling for line charts
- [#1036](https://github.com/neo4j-labs/neodash/pull/1036) - Fix table cell rule-based styling
- [#1029](https://github.com/neo4j-labs/neodash/pull/1029) - Fix rule-based styling for numeric values
- [#1028](https://github.com/neo4j-labs/neodash/pull/1028) - Fix OpenStreetMap leaflet display
- [#1020](https://github.com/neo4j-labs/neodash/pull/1020) - Fix boolean handling in parameter selection
- [#1014](https://github.com/neo4j-labs/neodash/pull/1014) - Remove autoPageSize flag (defaults to 0)
- [#1009](https://github.com/neo4j-labs/neodash/pull/1009) - Fix SSO parameters lost on browser redirect
- [#1008](https://github.com/neo4j-labs/neodash/pull/1008) - Fix existence check for `value.low`
- [#1005](https://github.com/neo4j-labs/neodash/pull/1005) - Replace Neo4j Logo
- [#1002](https://github.com/neo4j-labs/neodash/pull/1002) - Patch FAQ on supportability
- [#999](https://github.com/neo4j-labs/neodash/pull/999) - Fix dark mode table header styling
- [#956](https://github.com/neo4j-labs/neodash/pull/956) - Change default protocol to `neo4j+s`

## NeoDash 2.4.9
This release adds some minor changes to documentation and implements some community contributions.
- Added notice about project evolution: [#967](https://github.com/neo4j-labs/neodash/pull/967)
- Added community contributions and bug fixes: 
[#967](https://github.com/neo4j-labs/neodash/pull/967)
[#894](https://github.com/neo4j-labs/neodash/pull/894)
[#822](https://github.com/neo4j-labs/neodash/pull/822)
[#951](https://github.com/neo4j-labs/neodash/pull/951)
[#946](https://github.com/neo4j-labs/neodash/pull/946)
[#944](https://github.com/neo4j-labs/neodash/pull/944)
[#943](https://github.com/neo4j-labs/neodash/pull/943)
[#938](https://github.com/neo4j-labs/neodash/pull/938)
[#935](https://github.com/neo4j-labs/neodash/pull/935)
[#918](https://github.com/neo4j-labs/neodash/pull/918)
[#908](https://github.com/neo4j-labs/neodash/pull/908)
[#906](https://github.com/neo4j-labs/neodash/pull/906)
[#902](https://github.com/neo4j-labs/neodash/pull/902)
[#895](https://github.com/neo4j-labs/neodash/pull/895)
[#893](https://github.com/neo4j-labs/neodash/pull/893)

## NeoDash 2.4.8
This is a minor release containing an important fix and other minor fixes:

- Fixed a bug where loading a dashboard would reset parameters to null ([887](https://github.com/neo4j-labs/neodash/pull/887)).
- Fix relationship width parameter for Graph report ([889](https://github.com/neo4j-labs/neodash/pull/889)).
  
Thanks to all the contributors for this release: 
- [alfredorubin96](https://github.com/alfredorubin96),
- [nielsdejong](https://github.com/nielsdejong).

## NeoDash 2.4.7
This is a minor release containing a few critical fixes and general code quality improvements:

- Fix multiple parameter select ([881](https://github.com/neo4j-labs/neodash/pull/881)).
- Fix parameter casting error when loading dashboards([874](https://github.com/neo4j-labs/neodash/pull/874)).
- Fix the fraud demo in the [Example Gallery](https://neodash-gallery.graphapp.io/).
  
Thanks to all the contributors for this release: 
- [alfredorubin96](https://github.com/alfredorubin96),
- [MariusC](https://github.com/mariusconjeaud),
- [elizarp](https://github.com/elizarp).

## NeoDash 2.4.6
This is a minor release containing a few critical fixes and some extra style customizations:

- Fix bad text wrapping for arrays in tables ([868](https://github.com/neo4j-labs/neodash/pull/868)).
- Make wrapping in table optional, disabled by default ([872](https://github.com/neo4j-labs/neodash/pull/872)).
- Fixed issues where cross database dashboard sharing always reverted back to the default database ([873](https://github.com/neo4j-labs/neodash/pull/873)).
- Added option to define style config using environment variables for the Docker image ([876](https://github.com/neo4j-labs/neodash/pull/876)). 

## NeoDash 2.4.5
This is a small release containing a few fixes:
- Fixed rendering of string arrays inside tables, report titles, and report action buttons [849](https://github.com/neo4j-labs/neodash/pull/849)
- Allowed text to wrap in tables, preserving the number of rows [852](https://github.com/neo4j-labs/neodash/pull/852)
- Disabled auto-sorting of Cypher query-based Parameter Select ; use Cypher ORDER BY to control result order [857](https://github.com/neo4j-labs/neodash/pull/857)
- Updated role selector menu, and made user updates more robust [854](https://github.com/neo4j-labs/neodash/pull/854)

Thanks to all the contributors for this release: 
- [MariusC](https://github.com/mariusconjeaud),
- [LiamEdwardsLamarche](https://github.com/LiamEdwardsLamarche),
- [AleSim94](https://github.com/AleSim94)

## NeoDash 2.4.4
This is a hotfix release fixing some breaking issues in the 2.4.3:
- Fixed number parsing using newer versions of the Neo4j driver. [811](https://github.com/neo4j-labs/neodash/pull/811)
- Reverted new connection handler for auto-renewed SSO sessions. [815](https://github.com/neo4j-labs/neodash/pull/815)
- Improved handling of parameters in form extension, resolved local state issues. [813](https://github.com/neo4j-labs/neodash/pull/813)
- Updated Role management extension to no longer execute queries in parallel, improved UX and error handling [813](https://github.com/neo4j-labs/neodash/pull/813)

If you are currently using NeoDash version 2.4.3, we recommend updating as soon as possible.

## NeoDash 2.4.3
This release contains several improvements and additions to multi-dashboard management, as well as a bug fixes and a variety of quality-of-life improvements:

Dashboard management and access control:
- Added a UI for handling dashboard access using RBAC, as well as a new extension to simply access control.
- Added button to sidebar to refresh the list of dashboards saved in the database.
- Improved handling and detection of draft dashboards in the dashboard sidebar.

Other improvements:
- Changed CSV export functionality for tables to use UTF-8 format.
- Various improvements / fixes to the documentation to include new images, and up-to-date functionality.
- Added logic for handling refresh tokens when connected to NeoDash via SSO.
- Incorporated tooltips for bar charts with and without custom labels.

Bug fixes and testing:
- Implemented bug fixes on type casting for numeric parameter selectors.
- Fixed issue with report actions not functioning properly on node click events.
- Extended test suite with Cypress tests for advanced settings in the bar chart.

Thanks to all the contributors for this release: 
- [OskarDamkjaer](https://github.com/OskarDamkjaer)
- [alfredorubin96](https://github.com/alfredorubin96),
- [AleSim94](https://github.com/AleSim94),
- [BennuFire](https://github.com/BennuFire),
- [jacobbleakley-neo4j](https://github.com/jacobbleakley-neo4j),
- [josepmonclus](https://github.com/josepmonclus)
- [nielsdejong](https://github.com/nielsdejong)


## NeoDash 2.4.2
This is a release with a large amount of quality of life improvements, as well as some new features:

- Visualize graphs in 3D with the new 3D graph report. [#737](https://github.com/neo4j-labs/neodash/pull/737)
- Improved dashboard management sidebar and handling of drafts. [#734](https://github.com/neo4j-labs/neodash/pull/734)
- Added parameter select setting for autopopulating first selector value. [#746](https://github.com/neo4j-labs/neodash/pull/746)
- Improved UX for editing page names & dashboard titles. [#743](https://github.com/neo4j-labs/neodash/pull/743)
- Unified common settings for each report type. [#724](https://github.com/neo4j-labs/neodash/pull/724)
- Title of the browser tab NeoDash runs on is now automatically set to the dashboard name.  [#708](https://github.com/neo4j-labs/neodash/pull/708)
- Fixed issue where invisible table columns were not handled correctly. [#695](https://github.com/neo4j-labs/neodash/pull/695)
- Miscellaneous bug fixes, style improvements & stability fixes. [#744](https://github.com/neo4j-labs/neodash/pull/744)


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


## NeoDash 2.4.0
NeoDash 2.4 is out! 🎂 This release packs a ton of new features, as well as improvements to the existing visualizations.

Key new features:
- A new sidebar with support for managing, save and load multiple dashboards directly from the UI.
   [#657](https://github.com/neo4j-labs/neodash/pull/657)
- Added **Forms** as a new extension. Forms let you combine multiple parameter selectors in one card and have users edit/submit data to Neo4j.  [#568](https://github.com/neo4j-labs/neodash/pull/568)
- Added a new advanced visualization type: Gantt charts. [#684](https://github.com/neo4j-labs/neodash/pull/684)
- Doubled the grid resolution for dashboards, giving you more freedom to arrange visualizations. [#682](https://github.com/neo4j-labs/neodash/pull/682)
- Several improvements for the natural language queries extension - including customizable prompting, and faster schema retrieval. [#600](https://github.com/neo4j-labs/neodash/pull/600)

Other improvements:
- Support for multiselect checkboxes as a report action for tables. [#688](https://github.com/neo4j-labs/neodash/pull/688/commits)
- Added keyboard shortcuts (CMD/CTRL+Enter) for running Cypher queries from the editor. [#694](https://github.com/neo4j-labs/neodash/pull/694/)
- Added new experimental graph layouts (trees in various directions), with customizable level distance. [#690](https://github.com/neo4j-labs/neodash/pull/690)
- Increased customizability for the Pie chart's styling.  [#638](https://github.com/neo4j-labs/neodash/pull/638/)
- Fixed issues with parameter selector: Better handling of integer / long parameters and processing external updates. [#641](https://github.com/neo4j-labs/neodash/pull/641/)
- Improvements on text readability for the experimental dark mode. [#668](https://github.com/neo4j-labs/neodash/pull/668/)
- UX improvements on database connection interface. [#675](https://github.com/neo4j-labs/neodash/pull/675/)
- Added option to provide a custom message when no data is returned by a report. [#683](https://github.com/neo4j-labs/neodash/pull/683/)
- Fixed issue where column names were not hidden correctly. [#685](https://github.com/neo4j-labs/neodash/pull/685/commits)

Thanks to all the contributors for this release: 
[alfredorubin96](https://github.com/alfredorubin96),
[AleSim94](https://github.com/AleSim94),
[BennuFire](https://github.com/BennuFire),
[jacobbleakley-neo4j](https://github.com/jacobbleakley-neo4j),
[hugorplobo](https://github.com/hugorplobo),
[brahmprakashMishra](https://github.com/brahmprakashMishra),
[m-o-n-i-s-h](https://github.com/m-o-n-i-s-h),
[JonanOribe](https://github.com/JonanOribe),
[nielsdejong](https://github.com/nielsdejong)

## NeoDash 2.3.5
This is a bugfix / stability release directly following 2.3.4.

Improvements:
- Fixed issue where orphan relationships prevented graph charts from working ([@BennuFire](https://github.com/BennuFire), [#586](https://github.com/neo4j-labs/neodash/pull/586))
- Fix issue where only one style rule was used a time on tables. ([@BennuFire](https://github.com/BennuFire), [#632](https://github.com/neo4j-labs/neodash/pull/632))
- Added information about source and target on Graph Chart information modal . ([@BennuFire](https://github.com/BennuFire), [#627](https://github.com/neo4j-labs/neodash/pull/627)) Based on [@brahmprakashMishra](https://github.com/brahmprakashMishra) PR
- Fixed issue where bar charts where displaying black bars instead of scheme colors. ([@BennuFire](https://github.com/BennuFire), [#626](https://github.com/neo4j-labs/neodash/pull/626))
- Added right subpath replacement on shared links redirection while in self deployments. ([@m-o-n-i-s-h](https://github.com/m-o-n-i-s-h), [#618](https://github.com/neo4j-labs/neodash/pull/618))
- Dark theme tweaks. ([@BennuFire](https://github.com/BennuFire), [#585](https://github.com/neo4j-labs/neodash/pull/585))
- Fixed parameter selector search where numbers were not found and sporadically displayed with decimal points. ([@BennuFire](https://github.com/BennuFire), [#633](https://github.com/neo4j-labs/neodash/pull/633))
- Added a configuration in order to list sso providers to be used whenever a database has more than one configured. ([@BennuFire](https://github.com/BennuFire), [#624](https://github.com/neo4j-labs/neodash/pull/624))
- Added 'Ignore undefined parameters' advanced setting support for optional parameters on a query. Now queries will assume a null value instead of returning the error 'Parameter not defined'.  ([@BennuFire](https://github.com/BennuFire), [#625](https://github.com/neo4j-labs/neodash/pull/625))

## NeoDash 2.3.3 & 2.3.4
This is a bugfix / stability release directly following 2.3.2.

Improvements:
- Cleaned up dependencies, add lazy loading and code splitting in the bundle file for faster loading times. ([@BennuFire](https://github.com/BennuFire), [#545](https://github.com/neo4j-labs/neodash/pull/571))
- Migrated all icons from Material UI to Needle icons. ([@BennuFire](https://github.com/BennuFire), [#545](https://github.com/neo4j-labs/neodash/pull/571))
- Improved contrast for light and dark theme. ([@nielsdejong](https://github.com/nielsdejong), [#545](https://github.com/neo4j-labs/neodash/pull/566))
- Fixed issue where dashboards were locked in read-only mode, after toggling in the dashboard settings. ([@nielsdejong](https://github.com/nielsdejong), [#545](https://github.com/neo4j-labs/neodash/pull/566))
- Fixed issue where editing the name of a non-selected page changed the wrong page data. ([@BennuFire](https://github.com/BennuFire), [#545](https://github.com/neo4j-labs/neodash/pull/571))
- Fixed issue where color picker was only working on popup selections. ([@BennuFire](https://github.com/BennuFire), [#579](https://github.com/neo4j-labs/neodash/pull/579))
- Add user agent to driver session for better logging of NeoDash queries. ([@nielsdejong](https://github.com/nielsdejong), [#545](https://github.com/neo4j-labs/neodash/pull/574))


## NeoDash 2.3.2
What's new in NeoDash 2.3.2? A few bug fixes, performance improvements and more important, it ships phase 2 of our migration to [Needle](https://neo4j.com/developer-blog/needle-neo4j-design-system/)  !

- Key Features:
  - UI updated to use the **[Neo4j Design Language](https://www.neo4j.design/)** phase 2, giving NeoDash a similar look-and-feel to other Neo4j tools. This includes the removal of the sidebar and a complete refactor on the header component. ([@mariusconjeaud](https://github.com/mariusconjeaud),[@konsalex](https://github.com/konsalex),[@BennuFire](https://github.com/bennufire), [#552](https://github.com/neo4j-labs/neodash/pull/552))
  - *Experimental* Support for **Dark Mode**.
- Parameter Selector Chart
  - New advanced setting 'Manual Parameter Save' allowing  dashboard parameters propagation on demand (instead of automatically on change) ([@BennuFire](https://github.com/bennufire), [#545](https://github.com/neo4j-labs/neodash/pull/545))
  - Fix delete button leading to inconsistent values on click. ([@BennuFire](https://github.com/bennufire), [#545](https://github.com/neo4j-labs/neodash/pull/545))
  
  - Fix search on numbers not being triggered. ([@BennuFire](https://github.com/bennufire), [#545](https://github.com/neo4j-labs/neodash/pull/545))

- Others
  - Fix performance degradation on schema calculation ([@BennuFire](https://github.com/bennufire), [#555](https://github.com/neo4j-labs/neodash/pull/555))
  - Fix standalone bug that prevent user from using username and password fields([@BennuFire](https://github.com/bennufire), [#551](https://github.com/neo4j-labs/neodash/pull/551))
  - Added Sentry Support on https://neodash.graphapp.io ([@mariusconjeaud](https://github.com/mariusconjeaud), [#546](https://github.com/neo4j-labs/neodash/pull/546))
  - Fix SSO redirection on editor mode ([@BennuFire](https://github.com/bennufire), [#543](https://github.com/neo4j-labs/neodash/pull/543))

## NeoDash 2.3.1
What's new in NeoDash 2.3.1? A few bug fixes, improvement of natural language queries with support of Azure Open AI and parameters, Graph Vizualization relationship styling and more below!

- Natural language queries
  - **Support of Azure Open AI** ([@BennuFire](https://github.com/bennufire), [#515](https://github.com/neo4j-labs/neodash/pull/515))
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

## NeoDash 2.3.0
NeoDash 2.3 is out! This release brings a brand new look-and-feel, improved speed for large dashboards, and a new extension for querying Neo4j with natural language (using LLMs).

Key features:
- Write **[Natural Language Queries](https://neo4j.com/labs/neodash/2.3/user-guide/extensions/natural-language-queries/)** and use OpenAI to generate Cypher queries for your visualizations.
- UI updated to use the **[Neo4j Design Language](https://www.neo4j.design/)**, giving NeoDash a similar look-and-feel to other Neo4j tools.
- Customize branding, colors dynamically with a new [Style Configuration File](https://neo4j.com/labs/neodash/2.3/developer-guide/style-configuration).
  
Other changes:
- Fixed issues with date picker / free-text parameter sometimes not initializing.
- Improved documentation by fixing broken links, and adding more details around complex concepts. 
- **Pro Extensions have evolved to open Expert Extensions.**
- Fixed issue where deep-linked parameters were not set from the URL.
- Added option to specify absolute width for table columns (in pixels or as percentages).
- Fixed map charts to auto-cluster markers when they collide, or are too close together.
- ... and dozens of other improvements!



Contributors to this release:
- [Alfredo Rubin](https://github.com/alfredorubin96)
- [Harold Agudelo](https://github.com/BennuFire)
- [Aleksandar Simeunovic](https://github.com/AleSim94)
- [Marius Conjeaud](https://github.com/mariusconjeaud)
- [Brahm Prakash Mishra](https://github.com/brahmprakashMishra)
- [Pierre Martignon](https://github.com/pierremartignon)
- [Kim Zachariassen](https://github.com/KiZach)
- [Paolo Baldini](https://github.com/8Rav3n)
- [Niels de Jong](https://github.com/nielsdejong/)


## NeoDash 2.2.5
This is a minor release with some small bug fixes, directly following the 2.2.4 release.
- Fixed replacement rules for parameters in iFrames/Markdown reports. [#417](https://github.com/neo4j-labs/neodash/pull/417)
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
- **Report Actions**: Which let you create interactivity in dashboards, using the output of one report as input for another visualization. (Expert Extension)

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



