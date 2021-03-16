/**
 * Handles Neo4j Desktop integration.
 */
class DesktopIntegration {
    /**
     * On init, tries to get the active (running) database from Neo4j desktop.
     * Sets connection parameter accordingly.
     */
    constructor(context) {
        let neo4j = this.getActiveDatabase(context);
        if (neo4j) {
            this.connection = {
                url: neo4j.connection.configuration.protocols.bolt.url,
                database: "",
                username: neo4j.connection.configuration.protocols.bolt.username,
                password: neo4j.connection.configuration.protocols.bolt.password,
                encryption: neo4j.connection.configuration.protocols.bolt.tlsLevel === "REQUIRED" ? "on" : "off"

            }
        }
    }

    /**
     * Helper function to iterate over databases in Neo4j Desktop and select the first active one.
     */
    getActiveDatabase(context) {
        for (let pi = 0; pi < context.projects.length; pi++) {
            let prj = context.projects[pi];
            for (let gi = 0; gi < prj.graphs.length; gi++) {
                let grf = prj.graphs[gi];
                if (grf.status == 'ACTIVE') {
                    return grf;
                }
            }
        }
        // No active database found - ask for manual connection details.
        return null;
    }
}

export default (DesktopIntegration);