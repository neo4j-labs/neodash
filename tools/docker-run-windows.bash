# Set the environment variables to be picked up by the React app at runtime
port=8080
standalone=false
ssoEnabled=false
ssoDiscoveryUrl='https://example.com'
standaloneProtocol='neo4j+s'
standaloneHost='example.databases.neo4j.io'
standalonePort=7687
standaloneDatabase='neo4j'
standaloneDashboardName='My Dashboard'
standaloneDashboardDatabase='neo4j'


echo "-----------------------------------------------"
echo "neodash is available at http://localhost:$port."
echo "-----------------------------------------------"
winpty docker build --build-arg standalone=$standalone --build-arg ssoEnabled=$ssoEnabled --build-arg ssoDiscoveryUrl=$ssoDiscoveryUrl --build-arg standaloneProtocol=$standaloneProtocol --build-arg standaloneHost=$standaloneHost --build-arg standalonePort=$standalonePort --build-arg standaloneDatabase=$standaloneDatabase --build-arg standaloneDashboardName="${standaloneDashboardName}" --build-arg standaloneDashboardDatabase=$standaloneDashboardDatabase -t neodash .
winpty docker run -it --rm -p $port:80 neodash 