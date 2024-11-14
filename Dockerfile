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
COPY ./ /usr/local/src/neodash
RUN yarn run build-minimal

# production stage
FROM nginx:alpine3.18 AS neodash
RUN apk upgrade

ENV NGINX_PORT=5005

COPY --from=build-stage /usr/local/src/neodash/dist /usr/share/nginx/html
COPY ./conf/default.conf.template /etc/nginx/templates/
COPY ./scripts/config-entrypoint.sh /docker-entrypoint.d/config-entrypoint.sh
COPY ./scripts/message-entrypoint.sh /docker-entrypoint.d/message-entrypoint.sh

RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    chown -R nginx:nginx /etc/nginx/templates && \
    chown -R nginx:nginx /docker-entrypoint.d/config-entrypoint.sh && \
    chmod +x /docker-entrypoint.d/config-entrypoint.sh  && \
    chmod +x /docker-entrypoint.d/message-entrypoint.sh
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid
RUN chown -R nginx:nginx /usr/share/nginx/html/

## Launch webserver as non-root user.
USER nginx

EXPOSE $NGINX_PORT

HEALTHCHECK cmd curl --fail "http://localhost:$NGINX_PORT" || exit 1
LABEL version="2.4.9"
