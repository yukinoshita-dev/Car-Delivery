# CarDelivery handover

## 概要
社用車の予約・配車管理システム。ポートフォリオ用。
管理者と一般ユーザーのロール分けあり（デモ用ダミーログイン）。

## 技術スタック
- Backend: Python / FastAPI / PostgreSQL / Alembic / JWT認証 / python-jose
- Frontend: Next.js 15 / TypeScript / Tailwind CSS / shadcn/ui / TanStack Query v5 / Zustand v5 / react-hook-form + Zod
- Deploy: AWS App Runner（バックエンド）/ Amplify or Vercel（フロント）

## 現在のステータス
**Plan 2（認証）完了。Plan 3（レイアウト）が次。**

## 完了済み（Plan 1: 基盤）
- フロントエンド基盤: shadcn/ui・TanStack Query・Zustand・apiClient・型定義
- テスト環境: Vitest + Testing Library（9テスト通過）

## 完了済み（Plan 2: 認証）✅
### Task 1: バックエンド ダミーログインエンドポイント ✅
- `backend/app/schemas/user.py` に `LoginRequest` / `LoginResponse` 追加
- `backend/app/api/v1/endpoints/auth.py` を OAuth2Form → JSON body に書き換え
- `backend/app/services/auth_service.py` の `get_current_user` を email ベースに修正
- コミット: `feat: dummy login endpoint accepts JSON body with role` + `fix: align sub claim and role type with demo auth flow`

### Task 2: useLogin フック＋テスト ✅
- `frontend/src/features/auth/hooks/useLogin.ts` 作成
- `frontend/__tests__/features/auth/useLogin.test.ts` 作成（2テスト）
- コミット: `feat: add useLogin hook with store and cookie update`

### Task 3: LoginForm コンポーネント＋テスト ✅
- `frontend/src/features/auth/components/LoginForm.tsx` 作成（デモバナー・ロール選択・react-hook-form+zod）
- `frontend/__tests__/features/auth/LoginForm.test.tsx` 作成（5テスト）
- コミット: `feat: add LoginForm with demo banner and role toggle`

### Task 4: ログインページ＋ルートグループレイアウト ✅
- `frontend/src/app/(auth)/layout.tsx` 作成（中央揃えレイアウト）
- `frontend/src/app/(auth)/login/page.tsx` 作成
- `frontend/src/app/(app)/layout.tsx` 作成（シェル）
- `frontend/src/app/(app)/dashboard/page.tsx` 作成（プレースホルダー）
- コミット: `feat: add login page and app/auth route group layouts`

### Task 5: middleware.ts ルートガード ✅
- `frontend/src/middleware.ts` 作成（token Cookieでアクセス制御・adminロール確認）
- `frontend/src/features/auth/store.ts` の logout にCookie削除処理追加
- コミット: `feat: add middleware route guard and logout cookie cleanup`
- 全テスト 16件通過

## 次（Plan 3: レイアウト）
- Plan 3 ファイル: `docs/superpowers/plans/` 以下に作成が必要（まだ未作成）
- サイドバー・ヘッダー・アプリシェルの実装
- ナビゲーション・ユーザー情報表示・ログアウトボタン

## Plan 一覧
- Plan 1: 基盤 ✅ `docs/superpowers/plans/2026-04-24-01-base.md`
- Plan 2: 認証 ✅ `docs/superpowers/plans/2026-04-24-02-auth.md`
- Plan 3: レイアウト 🔜（未着手）
- Plan 4〜8: 予約・管理等（未着手）

## ローカル実行（バックエンド）
```bash
cd F:/business/My/portfolio/CarDelivery/backend
source venv/bin/activate  # or venv\Scripts\activate
uvicorn app.main:app --reload
# → http://localhost:8000/docs で Swagger UI 確認
```

## ローカル実行（フロントエンド）
```bash
cd F:/business/My/portfolio/CarDelivery/frontend
npm install
npm run dev
# → http://localhost:3000
```

## テスト実行
```bash
cd F:/business/My/portfolio/CarDelivery/frontend
npm run test:run
```

## メモ
- ダミーログイン: 任意のメアド・パスワード＋ロール選択で JWT 発行
- JWT の `sub` クレーム = メールアドレス（user ID ではない）
- デプロイ前にシードデータを用意する
- middleware はJWTのbase64デコードでroleを確認（署名検証なし・デモ用途のため）
