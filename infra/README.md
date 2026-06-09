# MusicOS Infrastructure

MusicOSのAWSリソースをAWS CDK v2で管理します。

## Prerequisites

- Node.js
- AWS CLIで認証済みであること
- デプロイ対象リージョンでCDK bootstrap済みであること

初回のみ、対象AWSアカウントとリージョンをbootstrapします。

```sh
npx cdk bootstrap
```

## Install

```sh
npm install
```

## Build

```sh
npm run build
```

## Synthesize

CloudFormationテンプレートを生成します。

```sh
npx cdk synth
```

または:

```sh
npm run synth
```

## Deploy

```sh
npx cdk deploy MusicOSStack
```

または:

```sh
npm run deploy -- MusicOSStack
```

## Destroy

開発環境のリソースを削除します。

```sh
npx cdk destroy MusicOSStack
```

または:

```sh
npm run destroy -- MusicOSStack
```

## Resources

- DynamoDB table: `Activities`
- Partition key: `userId` (`STRING`)
- Sort key: `activityId` (`STRING`)
- Billing mode: `PAY_PER_REQUEST`
- Point-in-time recovery: enabled
- Removal policy: `DESTROY`
