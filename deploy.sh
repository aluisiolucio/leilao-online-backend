#!/bin/bash

# Load Docker image
sudo docker load < nodeapp.tar.gz

# Run Docker container
sudo docker run -d --name leilao-api -p 5555:3000 \
  -e DATABASE_URL="$DATABASE_URL" \
  -e JWT_SECRET="$JWT_SECRET" \
  -e AWS_S3_BUCKET="$AWS_S3_BUCKET" \
  -e AWS_REGION="$AWS_REGION" \
  -e AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" \
  -e AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" \
  nodeapp:$SHA

# Prune Docker images
sudo docker image prune -a -f --filter "until=24h"
