## NeoDash 2.4.6
This is a minor release containing a few critical fixes and some extra style customizations:

- Fix bad text wrapping for arrays in tables ([868](https://github.com/neo4j-labs/neodash/pull/868)).
- Make wrapping in table optional, disabled by default ([872](https://github.com/neo4j-labs/neodash/pull/872)).
- Fixed issues where cross database dashboard sharing always reverted back to the default database ([873](https://github.com/neo4j-labs/neodash/pull/873)).
- Added option to define style config using environment variables for the Docker image ([876](https://github.com/neo4j-labs/neodash/pull/876)).