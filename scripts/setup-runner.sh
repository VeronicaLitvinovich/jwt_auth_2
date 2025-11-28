#!/bin/bash

echo "Setting up self-hosted runner environment..."

sudo apt-get update
sudo apt-get upgrade -y

sudo apt-get install -y \
    curl \
    docker.io \
    docker-compose \
    nginx \
    postgresql-client \
    jq

sudo usermod -aG docker $USER
sudo systemctl enable docker
sudo systemctl start docker

sudo mkdir -p /opt/your-app
sudo chown $USER:$USER /opt/your-app

echo "Setup completed. Please log out and log back in."