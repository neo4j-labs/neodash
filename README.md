
## NeoDash - Neo4j Dashboard Builder
NeoDash is an open source tool for visualizing your Neo4j data. It lets you group visualizations together as dashboards, and allow for interactions between reports. 

![screenshot](public/screenshot.png)

Neodash supports presenting your data as tables, graphs, bar charts, line charts, maps and more. It contains a Cypher editor to directly write the Cypher queries that populate the reports. You can save dashboards to your database, and share them with others.

## Running NeoDash
There are several ways to run the application:

1. You can install NeoDash into Neo4j Desktop from the [graph app gallery](https://install.graphapp.io). NeoDash will automatically connect to your active database.
2. You can run NeoDash from a web browser by visiting http://neodash.graphapp.io.
3. For offline deployments, you can build the application yourself, or pull the latest Docker image from Docker Hub to run the application:
```
# Run the application on http://localhost:5005
docker pull nielsdejong/neodash:latest
docker run -it --rm -p 5005:5005 nielsdejong/neodash
```

> Windows users may need to prefix the `docker run` command with `winpty`.

See the [Developer Guide](https://github.com/nielsdejong/neodash/wiki/Developer%20Guide) for more information.

## Questions / Suggestions
If you have any questions about NeoDash, please reach out. For feature requests, consider opening an issue on GitHub.

