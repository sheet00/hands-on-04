# ハンズオン分割テンプレート

このフォルダには、完成形テンプレートを段階的に分割した CloudFormation を置きます。

スタック名は次の通りにしてください。
1. `handson-01-network` -> `01-network.yaml`
2. `handson-02-security` -> `02-security.yaml`
3. `handson-03-alb` -> `03-alb.yaml`
4. `handson-04-ecs-cluster` -> `04-ecs-cluster.yaml`
5. `handson-05-cloudfront` -> `05-cloudfront.yaml`

## handson-01-network

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
  --stack-name handson-01-network
```

## handson-02-security

作成対象:
- ALB Security Group
- ECS Security Group

```bash
aws cloudformation deploy \
  --template-file cloudformation/handson/02-security.yaml \
  --stack-name handson-02-security
```

## handson-03-alb

作成対象:
- ALB
- Target Group
- Listener

```bash
aws cloudformation deploy \
  --template-file cloudformation/handson/03-alb.yaml \
  --stack-name handson-03-alb
```

## handson-04-ecs-cluster

作成対象:
- ECS Cluster
- Task Execution Role
- Task Role
- CloudWatch Logs
- Task Definition
- ECS Service

```bash
aws cloudformation deploy \
  --template-file cloudformation/handson/04-ecs-cluster.yaml \
  --stack-name handson-04-ecs-cluster \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    BedrockApiKey=YOUR_BEDROCK_API_KEY
```

## handson-05-cloudfront

作成対象:
- CloudFront Distribution

```bash
aws cloudformation deploy \
  --template-file cloudformation/handson/05-cloudfront.yaml \
  --stack-name handson-05-cloudfront
```
