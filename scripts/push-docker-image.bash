docker build --no-cache --label "version=2.1.0" . -t neodash
docker image tag neodash nielsdejong/neodash:2.1.0
docker image tag neodash nielsdejong/neodash:latest
docker push nielsdejong/neodash:2.1.0
docker push nielsdejong/neodash:latest

