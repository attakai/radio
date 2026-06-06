このフォルダは Nuxt 4 フロントエンド用です。

セットアップ（ローカルで実行する場合）:

1. nodeイメージを使うかローカルに Node.js を用意します。
2. 依存をインストール: `yarn install` または `npm install`
3. 開発サーバ起動: `yarn dev` または `npm run dev`

Docker Compose 経由で起動する場合、ルートで:

```bash
docker compose up --build
```

フロントは `http://localhost:3000`、バックは `http://localhost:8000` で確認します。
