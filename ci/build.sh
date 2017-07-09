#!/bin/sh
# Install docker-compose:
docker_install(){
  apk add --no-cache py-pip curl
  pip install docker-compose
}

# Set up docker daemon with a config file:
docker_config(){
  mkdir /etc/docker
  touch /etc/docker/daemon.json
  echo '{"storage-driver":"btrfs","debug":true}' > /etc/docker/daemon.json
}

# Start the docker daemon as a background task:
start_daemon(){
  dockerd --config-file=/etc/docker/daemon.json -p /var/run/docker-bootstrap.pid &
}

docker_install
docker_config
start_daemon

docker-compose run --rm frontend npm run build
docker-compose run --rm frontend npm run test
