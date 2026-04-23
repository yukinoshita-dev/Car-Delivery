---
paths: frontend/**
---

## Frontend ディレクトリ構成

```
frontend/
└── src/
    ├── app/            # App Router（Next.js 15）
    ├── components/     # UIコンポーネント
    └── lib/            # APIクライアント等
```

## ローカル起動（Frontend）

```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

## 環境変数（Frontend: .env.local）

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```
