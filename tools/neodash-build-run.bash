#!/bin/bash
docker build . -t neodash
docker run -it --rm -p 8080:80 neodash