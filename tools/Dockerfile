# build stage
FROM node:lts-alpine AS build-stage
RUN apk add --no-cache git
RUN git clone -b master https://github.com/nielsdejong/neodash.git /usr/local/src/neodash
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

## Launch webserver as non-root user
USER nginx
EXPOSE 5005
HEALTHCHECK cmd curl --fail http://localhost:5005 || exit 1
CMD ["nginx", "-g", "daemon off;"]

# neodash will be available at http://localhost:8080 by default.