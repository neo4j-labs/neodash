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
docker run -it --rm --env standalone=$standalone ssoEnabled=$ssoEnabled ssoDiscoveryUrl=$ssoDiscoveryUrl standaloneProtocol=$standaloneProtocol standaloneHost=$standaloneHost standalonePort=$standalonePort standaloneDatabase=$standaloneDatabase standaloneDashboardName=$standaloneDashboardName standaloneDashboardDatabase=$standaloneDashboardDatabase -p $port:80 neodash 