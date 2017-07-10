#!/bin/sh
set -e
source /docker-lib.sh
start_docker
docker-compose run --rm frontend npm run build
docker-compose run --rm frontend npm run test
docker-compose run --rm frontend npm run test-performance
docker-compose run --rm backend go build
docker-compose run --rm backend ./codecheck.sh
docker-compose rm -v -s -f
docker volume rm $(docker volume ls -q)
