# ダッシュボード設計ドキュメント (Plan 4)

## 概要
role別ダッシュボードを実装する。user は今日の配車状況＋自分の履歴、admin は統計カード＋今日の配車状況＋承認待ち一覧。

---

## バックエンド変更

### 1. seed.py（新規）
デモ用データ投入スクリプト。`admin@demo.com`（admin）と `user@demo.com`（user）のユーザー、車両2台、予約サンプル数件を作成。

### 2. `/dashboard/today` 修正
`car.name` / `user.name` / `user.email` を joinedload で取得して返す。  
新スキーマ `TodayReservationOut` を追加。

### 3. `GET /reservations/me?limit=5`（新規）
JWTから email を抽出し（DB lookup不要の軽量dependency）、users テーブルと join して該当ユーザーの予約を返す。

### 4. `GET /reservations?status=pending` はそのまま利用
既存エンドポイントで対応可能。`ReservationOut` に `car_name` / `user_name` を追加する。

---

## フロントエンド構成

```
features/dashboard/
├── hooks/
│   ├── useTodaySchedule.ts      GET /api/v1/dashboard/today
│   ├── useMyReservations.ts     GET /api/v1/reservations/me?limit=5
│   ├── usePendingApprovals.ts   GET /api/v1/reservations?status=pending
│   ├── useDashboardStats.ts     GET /api/v1/dashboard/stats
│   └── useApproveReservation.ts PUT /api/v1/reservations/{id}
└── components/
    ├── StatsCards.tsx           4枚の数字カード（adminのみ）
    ├── TodayScheduleCard.tsx    今日の配車状況テーブル（共通）
    ├── MyReservationsCard.tsx   直近5件＋ステータスバッジ（userのみ）
    └── PendingApprovalsCard.tsx 承認待ち一覧＋承認・却下ボタン（adminのみ）
```

---

## role別レイアウト

**user**
- 上: TodayScheduleCard（全幅）
- 下: MyReservationsCard（全幅）

**admin**
- 上: StatsCards（4枚横並び）
- 下左: TodayScheduleCard
- 下右: PendingApprovalsCard

---

## ステータスバッジカラー

| status | 色 |
|--------|-----|
| pending | yellow |
| approved | blue |
| in_progress | green |
| completed | gray |
| cancelled | red |

---

## 型定義追加（frontend types/index.ts）

```typescript
export interface TodayReservation {
  id: number
  car_id: number
  car_name: string
  user_id: number
  user_name: string
  user_email: string
  destination: string
  purpose: string | null
  start_datetime: string
  end_datetime: string
  status: ReservationStatus
}

// DashboardStats は既存定義を更新
export interface DashboardStats {
  total_cars: number
  available_cars: number
  in_use_cars: number
  completed_reservations_this_month: number
  pending_approvals: number
}
```

---

## データフロー

- TanStack Query `useQuery` で全データ取得
- 承認・却下: `useMutation` → `PUT /reservations/{id}` → `queryClient.invalidateQueries(['pending-approvals'])`
- 認証ヘッダー: 既存 `apiClient` が Authorization ヘッダーを自動付与
