# 管理者 予約管理ページ 設計ドキュメント (Plan 6)

## 概要
管理者が全予約を一覧・フィルタ・承認/却下できる2ページを実装する。

---

## バックエンド変更

なし。既存エンドポイントで対応:
- `GET /reservations/?status=<status>` — 全予約一覧（status省略で全件）
- `PUT /reservations/{id}` — ステータス更新（既存）

---

## フロントエンド構成

```
features/admin/
├── hooks/
│   └── useAllReservations.ts         GET /reservations/?status=...
└── components/
    └── ReservationRow.tsx            カード共通コンポーネント

app/(app)/admin/
├── approvals/page.tsx                承認待ち専用ページ
└── reservations/page.tsx             全予約 + タブフィルタページ
```

---

## コンポーネント詳細

### `ReservationRow`
表示項目:
- 申請者名 (`user_name`)
- 車両名 (`car_name`) → 行先 (`destination`)
- 日時 (`start_datetime` 〜 `end_datetime`)
- `StatusBadge` (既存コンポーネント流用)
- 承認・却下ボタン: **status === 'pending' のときのみ表示**

ボタン動作: `useApproveReservation`（`features/dashboard/hooks` から import）

### `useAllReservations(status?: string)`
```typescript
export function useAllReservations(status?: string) {
  return useQuery({
    queryKey: ['all-reservations', status],
    queryFn: () => apiClient.get<ReservationDetail[]>(
      status ? `/reservations/?status=${status}` : '/reservations/'
    ),
  })
}
```

---

## ページ詳細

### `/admin/approvals`
- `usePendingApprovals`（既存）で pending 予約を取得
- `ReservationRow` を並べるだけ（タブなし）
- 承認待ちが0件の場合は「承認待ちの申請はありません」

### `/admin/reservations`
- タブ: 全て / 承認待ち / 承認済み / 進行中 / 完了 / キャンセル
- 選択タブに対応するステータス文字列を `useAllReservations` に渡す
- 「全て」タブでは `status` を渡さない
- 各タブで `ReservationRow` を一覧表示

---

## テスト

```typescript
// useAllReservations.test.ts
// - status 未指定 → GET /reservations/ を呼ぶ
// - status='pending' → GET /reservations/?status=pending を呼ぶ

// ReservationRow.test.tsx
// - pending の予約 → 承認・却下ボタンが表示される
// - approved の予約 → ボタンが表示されない
```

---

## 型

既存の `ReservationDetail` を使用:
```typescript
export interface ReservationDetail {
  id: number
  user_id: number
  car_id: number
  car_name: string
  user_name: string
  user_email: string
  destination: string
  purpose: string | null
  start_datetime: string
  end_datetime: string
  status: ReservationStatus
  mileage_used: number
  note: string | null
  created_at: string
}
```
