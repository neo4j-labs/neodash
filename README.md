
## NeoDash - Neo4j Dashboard Builder
NeoDash is an open source tool for visualizing your Neo4j data. It lets you group visualizations together as dashboards, and allow for interactions between reports. 

![screenshot](public/screenshot.png)

Neodash supports presenting your data as tables, graphs, bar charts, line charts, maps and more. It contains a Cypher editor to directly write the Cypher queries that populate the reports. You can save dashboards to your database, and share them with others.

## Running NeoDash
There are three ways to run the application:

1. You can install NeoDash into Neo4j Desktop from the [graph app gallery](https://install.graphapp.io). NeoDash will automatically connect to your active database.
2. You can run NeoDash from a web browser by visiting http://neodash.graphapp.io.
3. For offline deployments, you can build the application yourself. See the developer guide below.


# Developer Guide
## Run locally with Docker
Pull the latest image from Docker Hub to run the application locally:
```
# Run the application on http://localhost:8080
docker pull nielsdejong/neodash:latest
docker run -it --rm -p 8080:80 nielsdejong/neodash
```

## Run & Build using npm
NeoDash is built with React. You'll need `npm` installed to run the web app.

> Use a recent version of `npm` and `node` to build NeoDash. The application has been tested with npm 8.3.1 & node v17.4.0.

To run the application in development mode:
- clone this repository.
- open a terminal and navigate to the directory you just cloned.
- execute `npm install` to install the necessary dependencies.
- execute `npm run dev` to run the app in development mode.
- the application should be available at http://localhost:3000.


To build the app for production:
- follow the steps above to clone the repository and install dependencies.
- execute `npm run build`. This will create a `build` folder in your project directory.
- deploy the contents of the build folder to a web server. You should then be able to run the web app.


## Build Docker image
A pre-built Docker image is available [on DockerHub](https://hub.docker.com/r/nielsdejong/neodash). 
This image is built using the default configuration (running in editor mode, without SSO).

### To build the image yourself:

Make sure you have a recent version of `docker` installed to build the multi-stage NeoDash image and run it.

On Unix (Mac/Linux) systems:
```
$ ./scripts/docker-build-run-unix.bash 
```

If you use Windows, you should have installed WSL. In WSL, you can run the script as follows:
```
$ ./scripts/docker-build-run-windows.bash
```
Then visit `http://localhost:8080` in your browser.


## Run in standalone mode
NeoDash can be deployed in a 'standalone mode' for dashboard viewers. This mode will:
- Disable all editing options
- Have a hardcoded Neo4j URL and database name
- Load a dashboard from Neo4j with a fixed name.

The diagram below illustrates how NeoDash standalone mode can be deployed next to a standard 'Editor Mode' instance:

![](doc/standalone-architecture.png)

You can configure an instance to run as standalone by changing the variables in `scripts/docker-build-run-unix.bash`, or, if you're not using docker, directly modifying `public/config.json`. Note that the editor mode is determined at runtime by the React app, and *not* at build time. You therefore do not need to (re-)build the React application, just the image.

 ## Extending NeoDash
There are two categories of extensions to NeoDash you can build:
- Core Dashboard Functionality
- Custom Reports

The first will require some knowledge about React, Redux, and app internals. Some advanced level knowledge is therefore highly recommended. The second is much simpler, and you should be able to plug in your own visualizations with minimal JS knowledge.

### Core Dashboard Functionality
To extend the core functionality of the app, it helps to be familiar with the following concepts:
- ReactJS
- Redux (State management for React)
- Redux Selectors
- Redux Thunks

The image below contains a high-level overview of the component hierarchy within the application. The following conceptual building blocks are used to create the interface:
- The Application
- The Dashboard
- Modals 
- Drawer
- Dashboard Header
- Pages
- Cards
- Card Views
- Card Settings
- Card View Header
- Report
- Card View Footer
- Card Settings Header
- Card Settings Content
- Card Settings Footer
- Charts

![](doc/component-hierarchy.png)

 ### Custom Reports
 As of v2.0, NeoDash is easy to extend with your own visualizations. There are two steps to take to plug in your own charts:
 
####  1. Create the React component
All NeoDash charts implement the interface defined in `src/charts/Chart.tsx`. A custom chart must do the same. the following parameter as passed to your chart from the application:
- `records`: a list of Neo4j Records. This is the raw data returned from the Neo4j driver. 
- `settings`: a dictionary of settings as defined under "advanced report settings" for each report. You can use these values to customize your visualization based on user input.
- `selection`: a dictionary with the selection made in the report footer.
- `dimensions`: an array with the dimensions of the report (mostly not needed, charts automatically fill up space).
- `queryCallback`: a way for the report to read more data from Neo4j, on interactions.
- `setGlobalParameter`: a way for the report to set globally available Cypher parameters, on interactions.

Make sure that your component renders a React component. your component will be automatically scaled to the size of the report. See the other charts in `src/charts/` for examples. 

#### 2. Extend the config to make your component selectable

To let users choose your visualization, you must add it to the app's report configuration. This config is located in `src/config/ReportConfig.tsx`, and defined by the dictionary `REPORT_TYPES`.

To add your visualization to the config, add a new key to the `REPORT_TYPES` dictionary with a unique name. The entry's value is an object which can contain the following fields:
- `label`: a display name for the visualization. Mandatory.
- `component`: the React component that renders the visualization. Mandatory.
- `helperText`: a string that is show under the query box in the report settings. Mandatory.
- `selection`: a list that contains each of the selection boxes present in the report footer. Optional.
- `settings`: a list of selection boxes that shows under the advanced settings. Optional.
- `maxRecords`: a hard limit on the number of records the visualization can handle. Mandatory.
- `useRecordMapper`: whether to use the in-built record mapper to fix your results in a specific format. Optional.
- `useNodePropsAsFields`: whether to use the node property selector as a report footer override. Optional.

If all works, please consider contributing your code to this repository.

## Questions / Suggestions
If you have any questions about NeoDash, please reach out. For feature requests, consider opening an issue(link) on GitHub.

