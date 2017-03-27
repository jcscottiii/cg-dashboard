#!/bin/bash

# This script will install the autopilot plugin, login, pick the right manifest and deploy the app with 0 downtime.

# Command line arguments
# $1 = specified environment

set -e
set -o pipefail

manifest_env=${1:-govcloud}

# Install cf cli
curl -v -L -o cf-cli_amd64.deb 'https://cli.run.pivotal.io/stable?release=debian64&source=github'
sudo dpkg -i cf-cli_amd64.deb
cf -v

# Install autopilot plugin for blue-green deploys
go get github.com/contraband/autopilot
cf install-plugin -f /home/ubuntu/.go_workspace/bin/autopilot

# Note: Spaces and deployer account username are the same in different environments.
# Only the organization, api, deployer account password differ.

CF_MANIFEST="manifest-testing-demo.yml"
CF_SPACE="dashboard-stage"
CF_APP="cg-dashboard-testing-server"

echo env:      $manifest_env
echo manifest: $CF_MANIFEST
echo space:    $CF_SPACE

if [ $manifest_env == govcloud ]; then
  CF_API=$CF_API_GC
  CF_PASSWORD=$CF_PASSWORD_GC
  CF_ORGANIZATION=$CF_ORGANIZATION_GC
fi

function deploy () {
  local manifest=${1}
  local org=${2}
  local space=${3}
  local app=${4}

  # Log in
  cf api $CF_API
  cf auth $CF_USERNAME $CF_PASSWORD
  cf target -o $org -s $space

  # Run autopilot plugin
  cf zero-downtime-push $app -f $manifest
}

# Set manifest path for environment
MANIFEST_PATH=manifests/$manifest_env/$CF_MANIFEST
deploy "$MANIFEST_PATH" "$CF_ORGANIZATION" "$CF_SPACE" "$CF_APP"
