#!/bin/bash
set -euo pipefail

AWS_PROFILE="${AWS_PROFILE:-handson}"
AWS_REGION="${AWS_REGION:-ap-northeast-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-YOUR_ACCOUNT_ID}"
REPOSITORY_NAME="${REPOSITORY_NAME:-handson-04-repo}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

if [ "${AWS_ACCOUNT_ID}" = "YOUR_ACCOUNT_ID" ]; then
    echo "AWS_ACCOUNT_ID を設定してください。"
    exit 1
fi

LOCAL_IMAGE="${REPOSITORY_NAME}:${IMAGE_TAG}"
ECR_IMAGE="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPOSITORY_NAME}:${IMAGE_TAG}"

echo "Logging in to ECR..."
AWS_PROFILE="${AWS_PROFILE}" aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "Building Docker image..."
docker build -f ecr/Dockerfile -t "${LOCAL_IMAGE}" .

echo "Tagging image..."
docker tag "${LOCAL_IMAGE}" "${ECR_IMAGE}"

echo "Pushing image to ECR..."
docker push "${ECR_IMAGE}"

echo "Done!"
