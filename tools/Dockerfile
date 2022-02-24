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

# Set the defaults for the build arguments. When the image is created, these variables can be changed with --build-arg
# Such as --build-arg ssoEnabled=true
ARG standalone=false
ARG ssoEnabled=false
ARG ssoDiscoveryUrl='https://example.com'
ARG standaloneProtocol='neo4j+s'
ARG standaloneHost='test.databases.neo4j.io'
ARG standalonePort=7687
ARG standaloneDatabase='neo4j'
ARG standaloneDashboardName='My Dashboard'
ARG standaloneDashboardDatabase='neo4j'

LABEL version="2.0.11"

# Dynamically set app config on container startup.
RUN echo " \
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
    }" > /usr/share/nginx/html/config.json
    
CMD ["nginx", "-g", "daemon off;"]

# neodash will be available at http://localhost:8080 by default.
