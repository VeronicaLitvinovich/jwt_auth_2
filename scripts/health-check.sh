#!/bin/bash

HEALTH_CHECK_URL="http://localhost:8080/api/test/all"
MAX_ATTEMPTS=5
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "Health check attempt $ATTEMPT of $MAX_ATTEMPTS"
    
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_CHECK_URL)
    
    if [ "$RESPONSE" = "200" ]; then
        echo "Application is healthy"
        exit 0
    fi
    
    echo "Health check failed with status: $RESPONSE"
    sleep 10
    ATTEMPT=$((ATTEMPT + 1))
done

echo "Health check failed after $MAX_ATTEMPTS attempts"
exit 1