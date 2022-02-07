FROM node:latest AS builder

# Clone repo and install npm required packages
RUN git clone -b master https://github.com/nielsdejong/neodash.git /usr/local/src/neodash
RUN npm install -g typescript jest 

# Install and build application
WORKDIR /usr/local/src/neodash
RUN npm install
RUN npm run build

## Launch webserver
FROM nginx:mainline AS neodash
LABEL org.opencontainers.image.authors="kayra.otaner@adp.com, niels.dejong@neo4j.com"
WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/local/src/neodash/dist /usr/share/nginx/html