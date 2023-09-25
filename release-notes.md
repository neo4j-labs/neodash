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