#!/bin/bash
docker build . -t neodash

# Set the environment variables to be picked up by the React app at runtime
port=8080
standalone=false
ssoEnabled=false
ssoDiscoveryUrl='https://example.com'
standaloneProtocol='neo4j+s'
standaloneHost='test.databases.neo4j.io'
standalonePort=7687
standaloneDatabase='neo4j'
standaloneDashboardName='My Dashboard'
standaloneDashboardDatabase='neo4j'


echo "-----------------------------------------------"
echo "neodash is available at http://localhost:$port."
echo "-----------------------------------------------"
winpty docker run -it --rm --env standalone=$standalone --env ssoEnabled=$ssoEnabled --env ssoDiscoveryUrl=$ssoDiscoveryUrl --env standaloneProtocol=$standaloneProtocol --env standaloneHost=$standaloneHost --env standalonePort=$standalonePort --env standaloneDatabase=$standaloneDatabase --env standaloneDashboardName="${standaloneDashboardName}" --env standaloneDashboardDatabase=$standaloneDashboardDatabase -p $port:80 neodash 