# build stage
FROM neo4jlabs/neodash:latest AS neodash

ENV NGINX_HTTPS_PORT=5443

USER root

RUN mkdir -p /etc/nginx/certs

RUN --mount=type=secret,id=NEODASH_SSL_KEY \
    base64 -d /run/secrets/NEODASH_SSL_KEY > /etc/nginx/certs/key.pem

RUN --mount=type=secret,id=NEODASH_SSL_CERT \
    base64 -d /run/secrets/NEODASH_SSL_CERT > /etc/nginx/certs/cert.pem

COPY default.conf /etc/nginx/templates/default.conf.template
COPY default.conf /etc/nginx/conf.d/

RUN chown -R nginx:nginx /etc/nginx

USER nginx
EXPOSE $NGINX_HTTPS_PORT

HEALTHCHECK CMD curl --fail "https://localhost:$NGINX_HTTPS_PORT" || exit 1
LABEL version="1.0"