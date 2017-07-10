#!/bin/sh

TAG=$(git describe $(git rev-list --tags --max-count=1))
BRANCH=$(git rev-parse --abbrev-ref HEAD)
export BUILD_INFO=build::$BRANCH::$TAG::$(date -u "+%Y-%m-%d-%H-%M-%S")::$BUILD_PIPELINE_NAME::$BUILD_JOB_NAME::$BUILD_NAME::$(ci/scripts/npm-version.sh)
echo $BUILD_INFO
wget https://github.com/mikefarah/yaml/releases/download/1.11/yaml_linux_amd64 -O /tmp/yaml-cli
chmod +x /tmp/yaml-cli
/tmp/yaml-cli write -i manifests/manifest-base.yml env.BUILD_INFO $BUILD_INFO
