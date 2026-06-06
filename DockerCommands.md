# Docker 起動・確認コマンド集

以下はローカルで本リポジトリを使って開発するときに使うコマンドとその意味です。

順序（推奨）:

1. `docker compose build` — 依存イメージをビルド（初回またはDockerfile変更時）
2. `docker compose up -d` — コンテナ群をデタッチ（バックグラウンド）で起動
3. `docker compose ps` — 起動中のコンテナ一覧を確認
4. `docker compose logs -f` — コンテナのログをフォロー（実行中の出力確認）
5. `docker compose down` — コンテナを停止してネットワークをクリーン

代表的コマンドと意味（表）:

| コマンド | 意味 |
|---|---|
| `docker compose build` | `docker-compose.yml` の定義に従いイメージをビルドします。初回起動や Dockerfile を変更した後に実行します。 |
| `docker compose up --build` | ビルドしてからコンテナを起動します。短縮で `docker compose up -d --build` としてデタッチできます。 |
| `docker compose up -d` | コンテナをバックグラウンドで起動します（端末を占有しない）。 |
| `docker compose ps` | 起動中/停止中のコンテナ一覧と状態を表示します。 |
| `docker compose logs -f <service>` | 指定サービスのログをフォローし続けます（リアルタイム）。サービス省略で全サービスを表示。 |
| `docker compose exec <service> sh` | 実行中コンテナのシェルに入ります（例: `docker compose exec app sh`）。 |
| `docker compose down` | コンテナ群を停止し、ネットワークや匿名ボリュームを削除します（データが消える可能性あり）。 |

開発時のよく使うフロー（例）:

```bash
# 1回目（またはDockerfileを変えた）
docker compose up --build -d

# 状態確認
docker compose ps
docker compose logs -f

# 動作確認（ホストから）
curl http://localhost:8000/api/hello

# 終了
docker compose down
```

注意:
- `docker compose up` は `docker-compose` 旧コマンドと異なる場合があります（Docker Desktop などで利用可能）。
- `docker compose down` はボリュームを消すため、永続データがある場合は削除対象に注意してください。
