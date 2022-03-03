# build stage
FROM node:lts-alpine AS build-stage
RUN apk add --no-cache git
RUN git clone https://github.com/nielsdejong/neodash.git /usr/local/src/neodash
RUN npm install -g typescript jest 
WORKDIR /usr/local/src/neodash
RUN npm install
RUN npm run build

# production stage
FROM nginx:alpine AS neodash
RUN apk upgrade
COPY --from=build-stage /usr/local/src/neodash/dist /usr/share/nginx/html

# Set default config options
ENV standalone=false

RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d 
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid
RUN chown -R nginx:nginx /usr/share/nginx/html/

## Launch webserver as non-root user.
USER nginx
EXPOSE 5005
HEALTHCHECK cmd curl --fail http://localhost:5005 || exit 1

# Set the defaults for the environment variables. These can be changed at runtime by modifying the docker arguments, avoiding container rebuilds.
ENV standalone=false
ENV ssoEnabled=false
ENV ssoDiscoveryUrl='https://example.com'
ENV standaloneProtocol='neo4j+s'
ENV standaloneHost='test.databases.neo4j.io'
ENV standalonePort=7687
ENV standaloneDatabase='neo4j'
ENV standaloneDashboardName='My Dashboard'
ENV standaloneDashboardDatabase='neo4j'

LABEL version = "2.0.12"

# Dynamically set app config on container startup.
ENTRYPOINT echo " \
    { \
    \"ssoEnabled\": ${ssoEnabled}, \
    \"ssoDiscoveryUrl\": \"${ssoDiscoveryUrl}\",  \
    \"standalone\": ${standalone}, \
    \"standaloneProtocol\": \"${standaloneProtocol}\", \
    \"standaloneHost\": \"${standaloneHost}\", \
    \"standalonePort\": ${standalonePort}, \
    \"standaloneDatabase\": \"${standaloneDatabase}\",  \
    \"standaloneDashboardName\": \"${standaloneDashboardName}\", \
    \"standaloneDashboardDatabase\": \"${standaloneDashboardDatabase}\"  \
    }" > /usr/share/nginx/html/config.json && \
    nginx -g 'daemon off;'

# neodash will be available at http://localhost:8080 by default.