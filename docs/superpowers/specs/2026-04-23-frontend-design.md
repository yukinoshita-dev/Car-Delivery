# CarDelivery フロントエンド実装方針 設計書

> ステータス：**完成**（2026-04-23）

---

## 1. 技術スタック

| 役割 | ライブラリ | 採用理由 |
|------|-----------|---------|
| フレームワーク | Next.js 15 + React 19 + TypeScript | 既存構成 |
| スタイル | Tailwind CSS + shadcn/ui | 既存構成 |
| サーバー状態管理 | TanStack Query（React Query） | キャッシュ・ローディング・エラー状態の自動管理。ポートフォリオ評価も高い |
| クライアント状態管理 | Zustand | 認証情報の管理に特化。localStorage 永続化を簡潔に実装できる |
| フォームバリデーション | react-hook-form + Zod | 型安全なバリデーション。FastAPI の Pydantic と対になる設計 |
| 実装戦略 | フィーチャー完結型 | 機能単位で API 結合まで完成させ、デモ可能な状態を早期に作る |

---

## 2. フォルダ構成

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   └── (app)/                  # 認証済みユーザー向け（共通レイアウト適用）
│       ├── layout.tsx          # サイドバー・ヘッダーを含む共通レイアウト
│       ├── dashboard/
│       │   └── page.tsx
│       ├── reservations/
│       │   ├── page.tsx
│       │   └── new/
│       │       └── page.tsx
│       ├── cars/
│       │   └── page.tsx
│       └── admin/
│           ├── reservations/
│           │   └── page.tsx
│           ├── cars/
│           │   └── page.tsx
│           └── users/
│               └── page.tsx
│
├── features/                   # 機能単位モジュール
│   ├── auth/
│   │   ├── components/         # LoginForm など
│   │   ├── hooks/              # useLogin など
│   │   └── store.ts            # Zustand auth store
│   ├── cars/
│   │   ├── components/         # CarCard, CarForm など
│   │   └── hooks/              # useCars, useCreateCar など
│   ├── reservations/
│   │   ├── components/         # ReservationForm, ReservationList, Calendar など
│   │   └── hooks/              # useReservations, useCreateReservation など
│   └── dashboard/
│       └── components/         # TodaySchedule, PendingList, StatsChart など
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── ui/                     # shadcn/ui コンポーネント（自動生成）
│
├── lib/
│   ├── api.ts                  # fetch ラッパー（Authorization ヘッダー自動付与）
│   └── queryClient.ts          # TanStack Query クライアント設定
│
├── types/
│   └── index.ts                # Car / User / Reservation / Role 型定義
│
└── middleware.ts               # ルートガード（未ログイン → /login、ロール制御）
```

### Route Group の使い方
- `(auth)` グループ：サイドバー・ヘッダーなし。未ログインでもアクセス可。
- `(app)` グループ：全認証済みページ。共通レイアウトを適用。未ログインは `/login` にリダイレクト。

---

## 3. 状態管理の役割分担

### TanStack Query（サーバー状態）
- 担当：車両一覧・予約一覧・ダッシュボードデータ・ユーザー一覧
- 自動管理：キャッシュ・ローディング/エラー状態・更新後の自動再フェッチ

### Zustand（クライアント状態）
- 担当：JWTトークン・メールアドレス・ロール（admin/user）
- `localStorage` に永続化してリロード後も維持

### カスタムフックの構造（例）
```typescript
// features/cars/hooks/useCars.ts
export function useCars() {
  return useQuery({
    queryKey: ['cars'],
    queryFn: () => apiClient.get('/cars'),
  })
}

export function useCreateCar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => apiClient.post('/cars', data),
    onSuccess: () => queryClient.invalidateQueries(['cars']),
  })
}
```

### API クライアント（lib/api.ts）
`fetch` のラッパー。Zustand store からトークンを取得して `Authorization: Bearer <token>` ヘッダーを自動付与する。

---

## 4. 認証フロー

### 変更点（バックエンド修正が必要）
`POST /api/v1/auth/login` のリクエストに `role` フィールドを追加。メールアドレスの検証をなくし、渡された `role` でJWTを発行するように修正する。

### ログイン画面の仕様
- メールアドレス・パスワードの入力フォーム（見た目は本物、何を入力しても通過）
- **デモ告知バナー**（黄色）：「これはポートフォリオ用のデモシステムです。任意のメアド・パスワードでログインできます。」を画面上部に常時表示
- **ロール選択トグル**：「一般社員」「管理者」を選択して送信

### ログインフロー
1. 任意のメアド・パスワードを入力、ロールを選択してログインボタン押下
2. `POST /api/v1/auth/login { email, password, role }` をコール
3. FastAPI が `role` をそのままJWTに埋め込んで返す
4. Zustand store に `token / email / role` を保存 → `localStorage` 永続化
5. `/dashboard` にリダイレクト

### Zustand Auth Store
```typescript
interface AuthState {
  token: string | null
  email: string | null
  role: 'admin' | 'user' | null
  login: (token: string, email: string, role: 'admin' | 'user') => void
  logout: () => void
  isAdmin: () => boolean
}
```

### ルートガード（middleware.ts）
| 状況 | 動作 |
|------|------|
| 未ログインで `/dashboard` 等にアクセス | `/login` にリダイレクト |
| ログイン済みで `/login` にアクセス | `/dashboard` にリダイレクト |
| `user` ロールで `/admin/*` にアクセス | `/dashboard` にリダイレクト |

---

## 5. 実装フェーズ（フィーチャー完結型）

| # | フェーズ | 内容 | 完了の目安 |
|---|---------|------|-----------|
| 1 | 基盤セットアップ | shadcn/ui・フォルダ構成・型定義・APIクライアント・QueryClient・Zustand store | `npm run dev` でエラーなし起動 |
| 2 | 認証 | ログイン画面・ルートガード・Zustand 永続化・バックエンド修正（role フィールド対応） | ロール選択でログイン → ダッシュボードに遷移 |
| 3 | 共通レイアウト | サイドバー・ヘッダー・レスポンシブ対応 | ログイン後に画面枠が表示される |
| 4 | ダッシュボード | 今日の配車状況・自分の予約履歴・admin用未承認一覧・稼働率グラフ | ロール別でダッシュボードが動く |
| 5 | 車両機能 | 車両一覧（user）・車両管理CRUD（admin） | 車両の登録・編集・削除が動く |
| 6 | 予約機能 | 予約申請フォーム・一覧・ステータスフィルター・カレンダービュー | 予約申請〜承認フロー E2E で動く |
| 7 | 走行距離・完了処理 | completed への遷移・走行距離入力・累計反映 | 予約完了フローが動く |
| 8 | AWSデプロイ | RDS・App Runner・Amplify/Vercel | 本番URLで動作確認 |
