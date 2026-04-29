# 完成形テンプレート

`full-stack.yaml` は、ハンズオンの完成形を一気に作るための CloudFormation テンプレートです。

デフォルトの `ProjectName` は `handson-04-full` です。
完成形テンプレートで物理名を持つ主要リソースは、必ずこの `ProjectName` を接頭辞として使います。
そのため `ProjectName` が重ならない限り、同一リージョン内で名前衝突しない前提です。

作成対象:
- VPC
- Public Subnet x2
- Internet Gateway
- Route Table
- ALB
- ECS Cluster / TaskDefinition / Service
- CloudWatch Logs
- CloudFront

前提:
- コンテナイメージは `ECR Public` に push 済み
- Bedrock API キーをスタック作成時のパラメータで渡す
- ALB の Security Group は CloudFront managed prefix list からの HTTP のみ許可

主要パラメータ:
- `EcrImageUri`
- `BedrockApiKey`
- `BedrockModelId`
- `BedrockRegion`

デプロイ例:

```bash
aws cloudformation deploy \
  --template-file cloudformation/完成形/full-stack.yaml \
  --stack-name handson-04-full \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    ProjectName=handson-04-full \
    EcrImageUri=public.ecr.aws/o7b9y7i7/handson-04-repo:latest \
    BedrockApiKey=YOUR_BEDROCK_API_KEY \
    BedrockModelId=amazon.nova-micro-v1:0 \
    BedrockRegion=us-east-1
```

注意:
- これは「完成形の参照用」です。ハンズオンではこの構成を見ながら、各リソースを個別に手動作成する想定です。
- API キーは簡易化のためパラメータで渡しています。本番運用なら Secrets Manager などへ寄せたほうが安全です。
- この設定で ALB への直接アクセスは CloudFront origin-facing IP に限定されます。
- ただし「自分の CloudFront distribution だけ」に限定したい場合は、追加でカスタムヘッダー検証などを組み合わせるとより強くできます。
