# build stage
FROM node:lts-alpine3.18 AS build-stage

RUN yarn global add typescript jest
WORKDIR /usr/local/src/neodash

# Pull source code if you have not cloned the repository
#RUN apk add --no-cache git
#RUN git clone https://github.com/neo4j-labs/neodash.git /usr/local/src/neodash

# Copy sources and install/build
COPY ./package.json /usr/local/src/neodash/package.json
COPY ./yarn.lock /usr/local/src/neodash/yarn.lock

RUN yarn install
COPY --chown=101:101 ./ /usr/local/src/neodash

RUN yarn run build-minimal

# production stage
FROM nginxinc/nginx-unprivileged:latest AS neodash

COPY --chown=101:101 --from=build-stage /usr/local/src/neodash/dist /usr/share/nginx/html

USER root
RUN chown -R 101:101 /usr/share/nginx/html
COPY --chown=101:101 ./conf/default.conf /etc/nginx/conf.d/
COPY --chown=101:101 ./scripts/config-entrypoint.sh /docker-entrypoint.d/config-entrypoint.sh
COPY --chown=101:101 ./scripts/message-entrypoint.sh /docker-entrypoint.d/message-entrypoint.sh
RUN chmod +x /docker-entrypoint.d/config-entrypoint.sh
RUN chmod +x /docker-entrypoint.d/message-entrypoint.sh

USER 101
EXPOSE 5005

## Launch webserver as non-root user.
CMD ["nginx", "-g", "daemon off;"]
HEALTHCHECK cmd curl --fail http://localhost:5005 || exit 1
LABEL version="2.4.0"