#!/bin/sh
set -e
source /docker-lib.sh
start_docker
ls -al
echo 'stop'
ls -al ../
# Get build info
echo $BUILD_NAME
docker-compose run --rm \
  -e BUILD_PIPELINE_NAME=$BUILD_PIPELINE_NAME \
  -e BUILD_JOB_NAME=$BUILD_JOB_NAME \
  -e BUILD_NAME=$BUILD_NAME \
  backend "/bin/bash -c devtools/misc/burn_build_info.sh"
# run tests
docker-compose run --rm frontend npm run build
docker-compose run --rm frontend npm run test
docker-compose run --rm frontend npm run test-performance
docker-compose run --rm backend go build
docker-compose run --rm backend ./codecheck.sh
# clean up
docker-compose down -v || true
docker-compose rm -v -s -f || true
docker volume rm $(docker volume ls -q) || true
