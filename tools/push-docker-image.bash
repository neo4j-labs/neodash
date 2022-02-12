docker build --no-cache . -t neodash
docker image tag neodash nielsdejong/neodash
docker image tag neodash nielsdejong/neodash:2.0.10
docker push nielsdejong/neodash:latest
docker push nielsdejong/neodash:2.0.10
