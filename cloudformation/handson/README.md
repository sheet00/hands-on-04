# ハンズオン分割テンプレート

このフォルダには、完成形テンプレートを段階的に分割した CloudFormation を置きます。

想定順序:
1. `01-network.yaml`
2. `02-security.yaml`
3. `03-alb.yaml`
4. `04-ecs-cluster.yaml`
5. `05-ecs-service.yaml`
6. `06-cloudfront.yaml`

## 01-network.yaml

作成対象:
- VPC
- Public Subnet x2
- Internet Gateway
- Route Table
- Route

デプロイ例:

```bash
aws cloudformation deploy \
  --template-file cloudformation/handson/01-network.yaml \
  --stack-name handson-04-network
```

## 02-security.yaml

作成対象:
- ALB Security Group
- ECS Security Group

```bash
aws cloudformation deploy \
  --template-file cloudformation/handson/02-security.yaml \
  --stack-name handson-04-security
```

## 03-alb.yaml

作成対象:
- ALB
- Target Group
- Listener

```bash
aws cloudformation deploy \
  --template-file cloudformation/handson/03-alb.yaml \
  --stack-name handson-04-alb
```

## 04-ecs-cluster.yaml

作成対象:
- ECS Cluster
- Task Execution Role
- Task Role
- CloudWatch Logs

```bash
aws cloudformation deploy \
  --template-file cloudformation/handson/04-ecs-cluster.yaml \
  --stack-name handson-04-ecs-base \
  --capabilities CAPABILITY_NAMED_IAM
```

## 05-ecs-service.yaml

作成対象:
- Task Definition
- ECS Service

```bash
aws cloudformation deploy \
  --template-file cloudformation/handson/05-ecs-service.yaml \
  --stack-name handson-04-ecs-service \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    BedrockApiKey=YOUR_BEDROCK_API_KEY
```

## 06-cloudfront.yaml

作成対象:
- CloudFront Distribution

```bash
aws cloudformation deploy \
  --template-file cloudformation/handson/06-cloudfront.yaml \
  --stack-name handson-04-cloudfront
```
