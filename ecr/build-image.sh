#!/bin/bash
set -euo pipefail

IMAGE_NAME="${IMAGE_NAME:-handson-04-app}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

echo "Building Docker image..."
docker build -f ecr/Dockerfile -t "${IMAGE_NAME}:${IMAGE_TAG}" .

echo "Done: ${IMAGE_NAME}:${IMAGE_TAG}"
