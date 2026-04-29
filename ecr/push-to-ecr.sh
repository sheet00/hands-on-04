#!/bin/bash
set -euo pipefail

AWS_PROFILE="${AWS_PROFILE:-handson}"
AWS_REGION="${AWS_REGION:-us-east-1}"
REPOSITORY_NAME="${REPOSITORY_NAME:-handson-04-repo}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

LOCAL_IMAGE="${REPOSITORY_NAME}:${IMAGE_TAG}"

echo "Ensuring public repository exists..."
if ! AWS_PROFILE="${AWS_PROFILE}" aws ecr-public describe-repositories --region "${AWS_REGION}" --repository-names "${REPOSITORY_NAME}" >/dev/null 2>&1; then
    AWS_PROFILE="${AWS_PROFILE}" aws ecr-public create-repository --region "${AWS_REGION}" --repository-name "${REPOSITORY_NAME}" >/dev/null
fi

REPOSITORY_URI="$(
    AWS_PROFILE="${AWS_PROFILE}" aws ecr-public describe-repositories \
        --region "${AWS_REGION}" \
        --repository-names "${REPOSITORY_NAME}" \
        --query 'repositories[0].repositoryUri' \
        --output text
)"

ECR_IMAGE="${REPOSITORY_URI}:${IMAGE_TAG}"

echo "Logging in to ECR Public..."
AWS_PROFILE="${AWS_PROFILE}" aws ecr-public get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin public.ecr.aws

echo "Building Docker image..."
docker build -f ecr/Dockerfile -t "${LOCAL_IMAGE}" .

echo "Tagging image..."
docker tag "${LOCAL_IMAGE}" "${ECR_IMAGE}"

echo "Pushing image to ECR..."
docker push "${ECR_IMAGE}"

echo "Done!"
