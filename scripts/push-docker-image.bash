docker build --no-cache --label "version=2.0.12" . -t neodash
docker image tag neodash nielsdejong/neodash:2.0.12
docker image tag neodash nielsdejong/neodash:latest
docker push nielsdejong/neodash:2.0.12
docker push nielsdejong/neodash:latest

