#!/bin/sh
set -e
source /docker-lib.sh
start_docker
# Get build info
pip install --user ruamel.yaml
TAG=$(git describe $(git rev-list --tags --max-count=1))
BRANCH=$(git rev-parse --abbrev-ref HEAD)
export BUILD_INFO=build::$BRANCH::$TAG::$(date -u "+%Y-%m-%d-%H-%M-%S")::$BUILD_PIPELINE_NAME::$BUILD_JOB_NAME::$BUILD_NAME::$(ci/scripts/npm-version.sh)
echo $BUILD_INFO
python ci/scripts/vars-to-manifest.py
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
