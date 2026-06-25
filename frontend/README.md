# MusicOS Frontend

MusicOSのExpo / React Nativeフロントエンドです。

## Commands

```sh
npm install
npm start
npm run check
npm run build:web
```

## Environment

Create a local `.env` file from `.env.example` and set the deployed HTTP API endpoint.

```sh
EXPO_PUBLIC_API_BASE_URL=https://xxxxx.execute-api.ap-northeast-1.amazonaws.com
EXPO_PUBLIC_COGNITO_USER_POOL_ID=ap-northeast-1_xxxxx
EXPO_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

Activities are stored using the signed-in Cognito user's `sub` as `userId`.
AWS Amplify Auth persists the Cognito session tokens in React Native AsyncStorage and restores the
signed-in session when the app restarts.

## Architecture

```text
src/
├── app/                # Expo Router routes only
├── features/           # Feature-owned screens, components, hooks, and services
│   ├── activities/
│   ├── dashboard/
│   └── profile/
└── shared/             # Cross-feature theme and utilities
```

機能固有コードは各 `features` 配下に置き、複数機能から利用するものだけを `shared` に配置します。
