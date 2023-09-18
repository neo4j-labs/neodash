# NeoDash Documentation

This folder contains the documentation for the NeoDash project. The pages are written in AsciiDoc, and generated into webpages by Antora.

An external workflow picks up this directory, embeds it into the Neo4j docs, and makes sure generated files are automatically deployed to:
```
https://neo4j.com/labs/neodash/{version}
```
For example: https://neo4j.com/labs/neodash/2.3

## Local Build
To compile and view the documentation locally, run:
```
yarn install
yarn start:docs
```

Then, open your browser and navigate to http://localhost:8000/.