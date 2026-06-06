# aisanpo — Nuxt 4 (frontend) + Laravel 13 (backend) 環境

このリポジトリには Nuxt 4 フロントエンドと Laravel バックエンドの開発環境を素早く立ち上げるためのスキャフォールドと `docker-compose.yml` が含まれます。

重要ファイル:
- `docker-compose.yml` — Node, PHP-FPM, Nginx をまとめて起動します。
- `frontend/` — Nuxt 4 の最小構成ファイル。
- `backend/` — Laravel プロジェクトを配置するフォルダ（README に準備手順あり）。
- `nginx/conf.d/default.conf` — Nginx の設定（Laravel public を指す）。

セットアップ手順（おすすめ）:

1. Docker と Docker Compose をインストールします。
2. ルートで `docker compose up --build` を実行します。

ローカルで直接セットアップする場合:

- フロント: `cd frontend` → `yarn install` → `yarn dev`
- バック: `composer create-project laravel/laravel backend "^13.0"` を実行してから `php artisan serve` などで起動

注意:
- このリポジトリは最小スキャフォールドです。実運用前に `backend` に Laravel 本体を正しく構築してください。
