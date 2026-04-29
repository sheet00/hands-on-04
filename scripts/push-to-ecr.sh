#!/bin/bash
# scripts/push-to-ecr.sh

# 変数の設定（ハンズオン時に書き換え）
AWS_REGION="ap-northeast-1"
AWS_ACCOUNT_ID="YOUR_ACCOUNT_ID"
REPOSITORY_NAME="handson-04-repo"
IMAGE_TAG="latest"

echo "Logging in to ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

echo "Building Docker image..."
docker build -t ${REPOSITORY_NAME} ./docker

echo "Tagging image..."
docker tag ${REPOSITORY_NAME}:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPOSITORY_NAME}:${IMAGE_TAG}

echo "Pushing image to ECR..."
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPOSITORY_NAME}:${IMAGE_TAG}

echo "Done!"
