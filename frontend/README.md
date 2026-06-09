# MusicOS Frontend

MusicOSのExpo / React Nativeフロントエンドです。

## Commands

```sh
npm install
npm start
npm run check
npm run build:web
```

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
