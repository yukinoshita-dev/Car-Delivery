# CarDelivery handover

## 概要
社用車の予約・配車管理システム。ポートフォリオ用。
管理者と一般ユーザーのロール分けあり（デモ用ダミーログイン）。

## 技術スタック
- Backend: Python / FastAPI / PostgreSQL / Alembic / JWT認証 / python-jose
- Frontend: Next.js 15 / TypeScript / Tailwind CSS / shadcn/ui / TanStack Query v5 / Zustand v5 / react-hook-form + Zod
- Deploy: AWS App Runner（バックエンド）/ Amplify or Vercel（フロント）

## 現在のステータス
**Plan 3（レイアウト）完了。Plan 4（ダッシュボード）が次。**

## 完了済み（Plan 1: 基盤）✅
- フロントエンド基盤: shadcn/ui・TanStack Query・Zustand・apiClient・型定義
- テスト環境: Vitest + Testing Library（全テスト通過）

## 完了済み（Plan 2: 認証）✅
- ダミーログインエンドポイント（JSON body + role）
- useLogin フック（TanStack Query mutation + Zustand + Cookie）
- LoginForm（デモバナー・ロール選択・react-hook-form+zod）
- ログインページ・ルートグループレイアウト（(auth) / (app)）
- middleware.ts ルートガード（token Cookie でアクセス制御）

## 完了済み（Plan 3: レイアウト）✅
- `useUIStore`: サイドバーのcollapsed状態管理（Zustand）
- `UserDropdown`: アバター（イニシャル）+ ロールバッジ + ログアウト
- `Header`: pathname→タイトルマッピング + UserDropdown
- `Sidebar`: 折りたたみ式（w-56↔w-16）・blue-900背景・role別ナビ
- `AppShell`: Sidebar + Header + main の外枠
- `(app)/layout.tsx`: AppShell を組み込み完了
- 全22テスト通過

## 次（Plan 4: ダッシュボード）
- 未作成。brainstorming → writing-plans → executing-plans の流れで進める
- user向け: 今日の配車状況・自分の予約履歴直近5件
- admin向け: 上記 + 未承認申請一覧（ワンクリック承認/却下）+ 車両稼働率グラフ
- バックエンドエンドポイント: `/api/v1/dashboard/today` / `/api/v1/dashboard/stats`

## Plan 一覧
- Plan 1: 基盤 ✅ `docs/superpowers/plans/2026-04-23-01-foundation.md`
- Plan 2: 認証 ✅ `docs/superpowers/plans/2026-04-24-02-auth.md`
- Plan 3: レイアウト ✅ `docs/superpowers/plans/2026-04-25-03-layout.md`
- Plan 4〜8: ダッシュボード・予約・管理等（未着手）

## ローカル実行（バックエンド）
```bash
cd F:/business/My/portfolio/CarDelivery/backend
source venv/Scripts/activate
uvicorn app.main:app --reload
# → http://localhost:8000/docs で Swagger UI 確認
```

## ローカル実行（フロントエンド）
```bash
cd F:/business/My/portfolio/CarDelivery/frontend
npm run dev
# → http://localhost:3000
```

## テスト実行
```bash
cd F:/business/My/portfolio/CarDelivery/frontend
npm run test:run
```

## 動作確認手順（Plan 3完了後）
1. バックエンド + `npm run dev` 起動
2. `http://localhost:3000` → `/login` にリダイレクト
3. 一般社員でログイン → blue-900サイドバー付きダッシュボードが表示
4. サイドバーのトグルボタンで折りたたみ/展開
5. UserDropdownでメール・ロールバッジ確認、ログアウトで /login に戻る
6. 管理者でログイン → 承認・予約管理・車両管理・ユーザー管理ナビが表示

## メモ
- ダミーログイン: 任意のメアド・パスワード＋ロール選択で JWT 発行
- JWT の `sub` クレーム = メールアドレス
- middleware はJWTのbase64デコードでroleを確認（署名検証なし・デモ用途のため）
- CarDeliveryPJは確認なしで自律的に作業を進める
