#!/bin/sh
source /docker-lib.sh
start_docker
docker-compose run --rm frontend npm run build
docker-compose run --rm frontend npm run test
docker volume rm $(docker volume ls -q)
