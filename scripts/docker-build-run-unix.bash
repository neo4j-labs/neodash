# The port to expose NeoDash on.
port=5005
# Set `standalone=true`` to disable the editor, and create a 'fixed' dashboard view.
standalone=false 
# If `standalone=true`, the protocol for the hardcoded database connection.
standaloneProtocol='neo4j+s' 
# If `standalone=true`, the hostname for the hardcoded database connection.
standaloneHost='example.databases.neo4j.io' 
# If `standalone=true`, the port for the hardcoded database connection.
standalonePort=7687 
# If `standalone=true`, the database for the hardcoded database connection.
standaloneDatabase='neo4j'  
# If `standalone=true`, the name of the dashboard stored in Neo4j to load. This is case-sensitive, and will load the latest version of a dashboard with the exact name.
standaloneDashboardName='My Dashboard'
# If `standalone=true`, the database name that the "to be loaded" dashboard is stored in. 
standaloneDashboardDatabase='neo4j'

# SSO settings. Experimental.
ssoEnabled=false 
ssoDiscoveryUrl='https://example.com'

docker build --build-arg standalone=$standalone --build-arg ssoEnabled=$ssoEnabled --build-arg ssoDiscoveryUrl=$ssoDiscoveryUrl --build-arg standaloneProtocol=$standaloneProtocol --build-arg standaloneHost=$standaloneHost --build-arg standalonePort=$standalonePort --build-arg standaloneDatabase=$standaloneDatabase --build-arg standaloneDashboardName="${standaloneDashboardName}" --build-arg standaloneDashboardDatabase=$standaloneDashboardDatabase -t neodash .
docker run -it --rm -p $port:5005 neodash
