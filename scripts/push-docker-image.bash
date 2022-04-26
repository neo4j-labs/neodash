<<<<<<< HEAD
docker build --no-cache --label "version=2.1.0" . -t neodash
docker image tag neodash nielsdejong/neodash:2.1.0
docker image tag neodash nielsdejong/neodash:latest
docker push nielsdejong/neodash:2.1.0
=======
docker build --no-cache --label "version=2.0.15" . -t neodash
docker image tag neodash nielsdejong/neodash:2.0.15
docker image tag neodash nielsdejong/neodash:latest
docker push nielsdejong/neodash:2.0.15
>>>>>>> master
docker push nielsdejong/neodash:latest

