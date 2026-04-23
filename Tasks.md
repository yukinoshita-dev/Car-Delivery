# CarDelivery - タスク一覧

進め方：バックエンド → フロントエンドの順で実装
粒度：30分〜1時間で終わる細かいステップ単位
最優先：バックエンド基盤 ＋ API実装

---

## 凡例

- [ ] 未着手
- [x] 完了
- [-] スキップ・保留

---

## Phase 1: バックエンド基盤

> Pythonのインストールが完了してから着手

- [x] Python インストール確認（`python --version`）
- [x] 仮想環境の作成（`python -m venv venv`）
- [x] 依存パッケージのインストール（`pip install -r requirements.txt`）
- [x] `.env` ファイルの作成（`.env.example` をコピー）
- [x] PostgreSQL のローカル起動確認
- [x] DB作成（`createdb cardelivery`）
- [x] Alembic の初期化（`alembic init alembic`）
- [x] マイグレーションファイルの作成（`alembic revision --autogenerate`）
- [x] マイグレーションの実行（`alembic upgrade head`）
- [x] FastAPI 起動確認（`uvicorn app.main:app --reload`）
- [ ] Swagger UI の確認（`http://localhost:8000/docs`）

---

## Phase 2: バックエンド API 実装

### 認証
- [x] ダミーログインエンドポイントの実装（メール一致でJWT発行）
- [x] JWTデコードの依存関数作成（`get_current_user`）

### 車両API
- [x] 車両一覧 GET
- [x] 車両登録 POST
- [x] 車両更新 PUT
- [x] 車両削除 DELETE

### 予約API
- [x] 予約一覧 GET（クエリパラメータでステータス・ユーザーIDフィルター）
- [x] 予約申請 POST（重複チェックロジック込み）
- [x] 予約更新 PUT（承認・却下・走行距離入力・ステータス変更）
- [x] 予約削除 DELETE

### ダッシュボードAPI
- [x] 今日の配車状況 GET（`/api/v1/dashboard/today`）
- [x] 稼働率・統計 GET（`/api/v1/dashboard/stats`・admin用）

### ユーザーAPI
- [x] ユーザー一覧 GET
- [x] ユーザー登録 POST

---

## Phase 3: フロント基盤セットアップ

- [ ] shadcn/ui の導入（`npx shadcn@latest init`）
- [ ] Tailwind CSS のカラーテーマ設定（ビジネス系カラー）
- [ ] フォルダ構成の整備（`components/`, `lib/`, `hooks/`, `types/`）
- [ ] APIクライアントの作成（`lib/api.ts` / fetch wrapper）
- [ ] 型定義ファイルの作成（`types/index.ts`：Car / User / Reservation）
- [ ] 環境変数の設定（`.env.local`）

---

## Phase 4: 認証画面（フロント）

- [ ] ログインページの作成（`/login`）
- [ ] メール・パスワード入力フォームの実装
- [ ] ダミー認証ロジックの実装（`admin@demo.com` / `user@demo.com`）
- [ ] JWTトークンをlocalStorageに保存する処理
- [ ] ログイン後のリダイレクト処理（`/dashboard`）
- [ ] ログアウト処理
- [ ] 未ログイン時のルートガード（middlewareでリダイレクト）
- [ ] ロールによる画面制御の仕組み作成（adminとuserで出しわけ）

---

## Phase 5: レイアウト・ナビゲーション

- [ ] 共通レイアウトコンポーネントの作成（`components/layout/`）
- [ ] サイドバーナビゲーション（PC用）
- [ ] ハンバーガーメニュー（スマホ用）
- [ ] ヘッダーコンポーネント（ログインユーザー名・ロール表示）
- [ ] レスポンシブ対応の確認（Tailwind のブレークポイント調整）

---

## Phase 6: ダッシュボード（フロント）

### user向け
- [ ] 今日の配車状況カードの実装（車両・予約者・行先・時間）
- [ ] 自分の予約履歴コンポーネント（直近5件・ステータスバッジ付き）

### admin向け（userの内容に追加）
- [ ] 未承認申請一覧カードの実装（件数バッジ・ワンクリック承認ボタン）
- [ ] 車両稼働率グラフの実装（recharts 等で棒グラフ）

---

## Phase 7: 車両一覧（フロント）

- [ ] 車両一覧ページの作成（`/cars`）
- [ ] 車両カードコンポーネント（車両名・ナンバー・定員・使用状況・累計走行距離）
- [ ] 使用状況バッジ（空き：緑 / 使用中：黄 / メンテ中：赤）

---

## Phase 8: 予約申請（フロント）

- [ ] 予約申請ページの作成（`/reservations/new`）
- [ ] 車両選択コンポーネント（選択時に空き状況を表示）
- [ ] 日時ピッカーの実装（開始・終了）
- [ ] 行先・利用目的の入力フォーム
- [ ] フォームバリデーション（終了 > 開始 / 必須チェック）
- [ ] 申請完了後のフィードバック（トースト通知）

---

## Phase 9: 予約一覧・カレンダー（フロント）

- [ ] 予約一覧ページの作成（`/reservations`）
- [ ] ステータスフィルター（pending / approved / completed など）
- [ ] リストビューの実装
- [ ] カレンダービューの実装（`react-big-calendar` 等）
- [ ] カレンダーとリストの切り替えボタン
- [ ] 予約詳細モーダルの実装

---

## Phase 10: 管理者画面（フロント）

- [ ] 予約管理ページの作成（`/admin/reservations`）
- [ ] 全予約一覧テーブル（ステータス・ユーザー・車両・日時）
- [ ] 承認・却下ボタンの実装
- [ ] 走行距離入力モーダルの実装（completed への遷移時）
- [ ] 車両管理ページの作成（`/admin/cars`）
- [ ] 車両登録フォームの実装
- [ ] 車両編集・削除の実装
- [ ] ユーザー一覧ページの作成（`/admin/users`・閲覧のみ）

---

## Phase 11: フロント × バックエンド 結合

- [ ] APIクライアントの実装を本番エンドポイントに切り替え
- [ ] モックデータの削除
- [ ] 認証フローの結合確認
- [ ] ダッシュボードの結合確認
- [ ] 予約申請〜承認フローの E2E 確認
- [ ] 走行距離入力〜累計反映の確認

---

## Phase 12: AWS デプロイ

- [ ] RDS PostgreSQL のセットアップ
- [ ] バックエンドの Dockerfile 作成
- [ ] AWS App Runner へのデプロイ
- [ ] フロントエンドの Amplify または Vercel へのデプロイ
- [ ] 環境変数の本番設定（SECRET_KEY / DATABASE_URL / CORS）
- [ ] 本番 URL での動作確認

---

## 残課題・メモ

- Python のインストールが完了したら Phase 1 に着手
- デプロイ前にデモアカウントのシードデータを用意する
- ポートフォリオとして公開する際は README にデモ手順を記載する
