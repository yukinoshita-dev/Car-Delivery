---
paths: backend/**
---

## Backend ディレクトリ構成

```
backend/
├── app/
│   ├── main.py
│   ├── core/           # 設定・DB接続
│   ├── models/         # SQLAlchemyモデル
│   ├── schemas/        # Pydanticスキーマ
│   ├── api/v1/         # エンドポイント
│   └── services/       # ビジネスロジック
└── requirements.txt
```

## 認証仕様（ダミー）

ポートフォリオとしてクライアントがそのまま動かせるよう、ダミー認証を実装する。

- ログイン画面は本物っぽく作る（メール + パスワード入力フォーム）
- 固定のデモアカウントでログイン可能
- JWTトークン形式でフロントに渡す（見た目は本物）
- パスワードの検証は行わない（デモアカウントのメールが一致すればOK）

**デモアカウント**
| メール | ロール |
|--------|--------|
| admin@demo.com | admin |
| user@demo.com | user |

## ローカル起動（Backend）

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
# http://localhost:8000/docs でSwagger UI確認可能
```

## 環境変数（Backend: .env）

```
SECRET_KEY=demo-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/cardelivery
ALLOWED_ORIGINS=["http://localhost:3000"]
```
