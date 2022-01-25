FROM centos:centos8.3.2011 AS builder

RUN yum install -y epel-release; yum check-update; pwd
RUN yum install -y rsync git

RUN dnf module list nodejs && dnf module enable -y nodejs:12
RUN dnf install -y nodejs

RUN git clone -b 2.0.5 https://github.com/nielsdejong/neodash.git /usr/local/src/neodash
RUN npm install -g typescript
RUN npm install -g jest

RUN git clone https://github.com/nielsdejong/charts.git /usr/local/src/charts && cd /usr/local/src/charts && git checkout cd8bf3707d48f2c34ec6a1ad126cfd28b5ac3065
RUN cd /usr/local/src/charts; npm install; npm run build
WORKDIR /usr/local/src/neodash
RUN rm -rf node_modules/ && npm install
RUN cd /usr/local/src/neodash/node_modules/@graphapps/charts; rsync -avP /usr/local/src/charts/* .
RUN npm run build


FROM nginx:mainline AS neodash
LABEL org.opencontainers.image.authors="kayra.otaner@adp.com"
WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/local/src/neodash/build /usr/share/nginx/html