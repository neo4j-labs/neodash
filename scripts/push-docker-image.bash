docker build --no-cache --label "version=2.0.15" . -t neodash
docker image tag neodash nielsdejong/neodash:2.0.15
docker image tag neodash nielsdejong/neodash:latest
docker push nielsdejong/neodash:2.0.15
docker push nielsdejong/neodash:latest

