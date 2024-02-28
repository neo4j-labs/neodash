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
- [josepmonclus](https://github.com/josepmonclus)
- [alfredorubin96](https://github.com/alfredorubin96),
- [AleSim94](https://github.com/AleSim94),
- [BennuFire](https://github.com/BennuFire),
- [jacobbleakley-neo4j](https://github.com/jacobbleakley-neo4j),
- [nielsdejong](https://github.com/nielsdejong)
