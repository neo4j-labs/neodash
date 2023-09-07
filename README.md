# MADT4BC: Multi-Aspect Digital Twin for Business Continuity

## Installation

This software requires the following versions of node and yarn:

```
node version v20.2.0
yarn version 1.22.19
```

Install dependencies:

```
yarn install
```

Build local Docker image (the rest of the Docker images are pulled from web):

```
docker build -t mqtt-kafka-bridge -f docker/Dockerfile .
```


## Setup

Launch databases in docker:

```
docker compose up
```

Run in another terminal:

```
yarn run dev
```

Open the dashboard in browser: http://localhost:3000, choose "New Dashboard". 
Log in with user name: neo4j, password: sindit-neo4j.

If the database is empty, you can load one using one of these two approaches:

1. Press load dashboard button in left side panel. Choose "Select from file", and choose the sample database (json-file) in the "samples" folder in this repo.
2. Open Neo4j Browser at http://localhost:747. Copy the content in samples/sample-data.cypher and past it into the query box of the Neo4j browser, then execute the query.


## User Guide for NeoDash

NeoDash comes with built-in examples of dashboards and reports. For more details on the types of reports and how to customize them, see the [User Guide](
https://neo4j.com/labs/neodash/2.2/user-guide/).

## Publish Dashboards

After building a dashboard, you can chose to deploy a read-only, standalone instance for users. See [Publishing](https://neo4j.com/labs/neodash/2.2/user-guide/publishing/) for more on publishing dashboards.


## Questions / Suggestions

If you have any questions about NeoDash, please reach out to the maintainers:
- Create an [Issue](https://github.com/neo4j-labs/neodash/issues/new) on GitHub for feature requests/bugs.
- Connect with us on the [Neo4j Discord](https://neo4j.com/developer/discord/).
- Create a post on the Neo4j [Community Forum](https://community.neo4j.com/).

> NeoDash is a free and open-source tool developed by the Neo4j community - not an official Neo4j product. If you have a need for a commercial agreement around training, custom extensions or other services, please contact the [Neo4j Professional Services](https://neo4j.com/professional-services/) team.
