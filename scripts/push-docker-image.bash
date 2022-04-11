docker build --no-cache --label "version=2.0.14" . -t neodash
docker image tag neodash nielsdejong/neodash:2.0.14
docker image tag neodash nielsdejong/neodash:latest
docker push nielsdejong/neodash:2.0.14
docker push nielsdejong/neodash:latest

