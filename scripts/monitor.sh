#!/bin/bash

echo "=== Application Status ==="
docker-compose -f docker-compose.prod.yml ps

echo -e "\n=== Recent Logs ==="
docker-compose -f docker-compose.prod.yml logs --tail=50 app

echo -e "\n=== Disk Usage ==="
df -h