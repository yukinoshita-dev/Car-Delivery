# CarDelivery - 営業車配車管理システム

## 技術スタック

| 役割 | 技術 |
|------|------|
| Frontend | Next.js 15 + React 19 + TypeScript |
| Backend | Python + FastAPI |
| ORM | SQLAlchemy + Alembic |
| DB | PostgreSQL (AWS RDS) |
| Auth | NextAuth.js v5 |
| Deploy | AWS (Amplify + App Runner + RDS) |
| スタイル | Tailwind CSS + shadcn/ui |

## ディレクトリ構成

```
CarDelivery/
├── frontend/   # Next.js 15
└── backend/    # FastAPI
```

## セットアップ

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
cp .env.example .env    # 環境変数を設定
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API ドキュメント

バックエンド起動後、`http://localhost:8000/api/v1/openapi.json` で確認可能。
Swagger UI: `http://localhost:8000/docs`
