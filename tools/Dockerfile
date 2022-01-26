FROM centos:centos8.3.2011 AS builder

## Set up dependencies
RUN yum install -y epel-release; yum check-update; pwd
RUN yum install -y rsync git
RUN dnf module list nodejs && dnf module enable -y nodejs:16
RUN dnf install -y nodejs

# Clone repo and install npm required packages
RUN git clone -b develop https://github.com/nielsdejong/neodash.git /usr/local/src/neodash
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