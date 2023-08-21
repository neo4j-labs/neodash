## NeoDash 2.3.3
This is a bugfix / stability release directly following 2.3.2.

Improvements:
- Cleaned up dependencies, add lazy loading and code splitting in the bundle file for faster loading times. ([@BennuFire](https://github.com/BennuFire), [#545](https://github.com/neo4j-labs/neodash/pull/571))
- Migrated all icons from Material UI to Needle icons. ([@BennuFire](https://github.com/BennuFire), [#545](https://github.com/neo4j-labs/neodash/pull/571))
- Improved contrast for light and dark theme. ([@nielsdejong](https://github.com/nielsdejong), [#545](https://github.com/neo4j-labs/neodash/pull/566))
- Fixed issue where dashboards were locked in read-only mode, after toggling in the dashboard settings. ([@nielsdejong](https://github.com/nielsdejong), [#545](https://github.com/neo4j-labs/neodash/pull/566))
- Fixed issue where editing the name of a non-selected page changed the wrong page data. ([@BennuFire](https://github.com/BennuFire), [#545](https://github.com/neo4j-labs/neodash/pull/571))
- Add user agent to driver session for better logging of NeoDash queries. ([@nielsdejong](https://github.com/nielsdejong), [#545](https://github.com/neo4j-labs/neodash/pull/574))