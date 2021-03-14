# NeoDash Developer Guide
> This guide is a work in progress. it is still under active development. If you have any questions, reach out to niels.dejong@neo4j.com.

## Running NeoDash
There are three options for running NeoDash:

#### 1. From Neo4j Desktop
If you're using Neo4j Desktop, you can install NeoDash from the [Graph App Gallery](when).


#### 2. As a web app (publicly hosted)
The latest version of NeoDash will always be available at https://nielsdejong.nl/neodash.


#### 3. As a web app in your own hosted environment. 
To build the application for running in your own environment, take the following steps:

- clone or download this repository.
- Install `npm` (LINK)
- navigate to the directory of the repository
- run `npm install` to install dependencies
- run `npm run-script build` to build the application
- the app will be built to the `dist` folder.
- start your favourite webserver ( apache or nginx ) to host the dist directory.

## Extending NeoDash
NeoDash can be extended to support other visualizations and report types. This section will provide some pointers on how to add a new type of report to the application.

> If you're extending the application, please consider contributing to the repository by creating a [pull request](https://github.com/nielsdejong/neodash/pulls).


### 1. clone and run the application in development mode

## Developer Guide
NeoDash is built with React, and uses the `npm` package manager.
When running NeoDash, ensure that the `PUBLIC_URL` environment variable is set to where you are hosting the application.
Dependencies are specified in `package.json`.

> NeoDash is not intended to be used in a production setting by one or more users. [Get in touch](mailto:niels.dejong@neo4j.com) if you need help building a production-grade Neo4j front-end.
### Install
NeoDash can be installed using npm:
`npm install`
Running the application in development mode:
`npm start`

### Build
Building the application:




### 2. Adding the new report type

### 3. Making the new type selectable
