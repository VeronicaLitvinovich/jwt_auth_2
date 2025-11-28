#!/bin/bash

set -e

echo "Starting deployment..."

git pull origin main

docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

echo "Waiting for application to start..."
sleep 30

./scripts/health-check.sh

echo "Deployment completed successfully!"