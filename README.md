# CarDelivery - 営業車配車管理システム

ポートフォリオ用の社用車予約・配車管理Webシステムです。

## デモアカウント

| ロール | メール | パスワード |
|--------|--------|-----------|
| 一般社員 | user@demo.com | demo |
| 管理者 | admin@demo.com | demo |

## 技術スタック

| 役割 | 技術 |
|------|------|
| Frontend | Next.js 15 + React 19 + TypeScript |
| Backend | Python 3.12 + FastAPI |
| ORM | SQLAlchemy 2.0 + Alembic |
| DB | PostgreSQL (ローカル / AWS RDS) |
| 認証 | ダミーJWT認証（ポートフォリオ用） |
| Deploy | AWS (Amplify + App Runner + RDS) |
| スタイル | Tailwind CSS + shadcn/ui |

## ディレクトリ構成

```
CarDelivery/
├── frontend/    # Next.js 15
├── backend/     # FastAPI
└── .github/     # GitHub Actions (CI/CD)
```

## ローカルセットアップ

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # Windows
pip install -r requirements.txt
cp .env.example .env    # 環境変数を設定
alembic upgrade head    # DBマイグレーション
python seed.py          # デモデータ投入（初回のみ）
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL を設定
npm run dev
```

- ブラウザで `http://localhost:3000` を開く
- バックエンドは `http://localhost:8000` で起動が必要

## API ドキュメント

バックエンド起動後に確認できます。

- Swagger UI: `http://localhost:8000/docs`
- OpenAPI JSON: `http://localhost:8000/api/v1/openapi.json`

## AWSデプロイ

### 必要なAWSリソース

1. **RDS (PostgreSQL)** - データベース
2. **ECR** - Dockerイメージレジストリ
3. **App Runner** - バックエンドホスティング
4. **Amplify** - フロントエンドホスティング

### デプロイ手順

#### 1. RDS PostgreSQL のセットアップ

```bash
# AWS コンソール または CLI で RDS インスタンスを作成
aws rds create-db-instance \
  --db-instance-identifier cardelivery-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version "15" \
  --master-username postgres \
  --master-user-password <your-password> \
  --allocated-storage 20 \
  --db-name cardelivery
```

#### 2. ECR リポジトリ作成

```bash
aws ecr create-repository --repository-name cardelivery-backend --region ap-northeast-1
```

#### 3. App Runner サービス作成

AWS コンソール → App Runner → サービスを作成:
- ソース: ECR イメージ
- イメージ: `<aws-account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/cardelivery-backend:latest`
- ポート: `8000`
- 環境変数:
  - `SECRET_KEY`: ランダムな秘密鍵
  - `DATABASE_URL`: `postgresql://postgres:<password>@<rds-endpoint>:5432/cardelivery`
  - `ALLOWED_ORIGINS`: `["https://your-amplify-url.amplifyapp.com"]`

#### 4. Amplify フロントエンドデプロイ

```bash
# Amplify CLI を使う場合
amplify init
amplify add hosting
amplify publish
```

または AWS コンソール → Amplify → GitHubリポジトリと連携:
- ビルド設定で `NEXT_PUBLIC_API_URL` を App Runner の URL に設定

#### 5. GitHub Actions シークレット設定

```
AWS_ACCESS_KEY_ID      → IAMユーザーのアクセスキー
AWS_SECRET_ACCESS_KEY  → IAMユーザーのシークレットキー
AMPLIFY_APP_ID         → Amplify アプリ ID
```

main ブランチへの push で自動デプロイが実行されます。

### データベースマイグレーション（本番）

App Runner の「実行コマンド」またはローカルから実行:

```bash
DATABASE_URL=<本番RDS-URL> alembic upgrade head
DATABASE_URL=<本番RDS-URL> python seed.py   # デモデータ投入
```

## テスト

```bash
cd frontend
npm run test:run   # 全テスト実行
```
