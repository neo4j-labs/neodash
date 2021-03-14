# NeoDash Developer Guide
> This guide is a work in progress. it is still under active development. If you have any questions, reach out to niels.dejong@neo4j.com.

This document contains information on the following topics:
- Running NeoDash
- Extending NeoDash
- Contributing


## Running NeoDash
> If you let end-users access NeoDash, make sure you let them use a read-only account. 
> Be aware that users can run any Cypher query, so only give access to users you trust.
 
There are three options for running NeoDash:
- As a graph app (From Neo4j Desktop)
- As a publicly accessible website
- As a web-app in your own hosted environment
 
#### 1. From Neo4j Desktop
If you're using Neo4j Desktop, you can install NeoDash from the [Graph App Gallery](when).
NeoDash will automatically connect to your active database.

#### 2. Online
The latest version of NeoDash will always be available at https://nielsdejong.nl/neodash.
Your database credentials will only be cached in your browser.   

#### 3. As a web app in your own hosted environment
To build the application for running in your own environment, take the following steps:

- clone or download this repository.
- Install `npm`.
- navigate to the directory of the repository.
- run `npm install` to install dependencies.
- run `npm run-script build` to build the application. The app will be built to the `dist` folder.
- Use your favourite web server (`apache` or `nginx`) to host the `dist` folder.

Ensure that the `PUBLIC_URL` environment variable is set to where you are hosting the application.


## Extending NeoDash
NeoDash can be extended to support other visualizations and report types. 
This section will provide some instructions on how to extend the application to fit your needs.

### Adding a new report type
#### 1. Clone and run the application in development mode
NeoDash is built with React, and uses the `npm` package manager.
Dependencies are specified in `package.json`.

NeoDash can be installed using npm:
- `npm install`

Running the application in development mode:
- `npm start`



#### 2. Adding the new report type

#### 3. Making the new type selectable

#### 4. Build the application

## Contributing
If you're extending the application, please consider contributing to the repository by creating a [pull request](https://github.com/nielsdejong/neodash/pulls).
