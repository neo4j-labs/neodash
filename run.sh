#!/bin/bash

conda activate tf
docker-compose up &
yarn run dev &
cd connection
python3 minio_api.py &
python3 neo4j_api.py &
cd ../statistics
docker build -t statistics -f Dockerfile .
docker run -p 5003:5003 --network=sindit_network -it statistics &
