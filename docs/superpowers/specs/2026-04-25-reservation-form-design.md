# 配車予約申請フォーム設計ドキュメント (Plan 5)

## 概要
一般社員が配車予約を申請するフォームページを実装する。日時入力後にリアルタイムで空き車両を絞り込み、送信で `pending` 状態の予約を作成する。

---

## バックエンド変更

### 1. `GET /cars/available?start=&end=`（新規）
指定期間（start〜end）に重複する予約（pending/approved/in_progress）がない車両のみ返す。

### 2. `POST /reservations/` 修正
- `get_current_email` dependency を追加し、JWTのメールアドレスからユーザーを特定して `user_id` を自動設定
- `ReservationCreate` スキーマから `user_id` フィールドを削除

---

## フロントエンド構成

```
features/reservations/
├── hooks/
│   ├── useAvailableCars.ts        GET /cars/available?start=&end=
│   └── useCreateReservation.ts   POST /reservations/
└── components/
    ├── DateTimePicker.tsx         shadcn Calendar + time select
    └── ReservationForm.tsx        react-hook-form + zod フォーム

app/(app)/reservations/new/page.tsx
```

---

## フォームフロー

1. 開始日時・終了日時を入力（shadcn DatePicker + 時刻select）
2. 両方入力済み → `useAvailableCars` で空き車両取得 → 車両Selectを更新
3. 車両・行先・目的を入力 → 送信
4. 成功 → `/dashboard` リダイレクト
5. 409重複エラー → フォーム上にエラーメッセージ表示

---

## Zod バリデーション

```typescript
z.object({
  start_datetime: z.string().min(1, '開始日時を入力してください'),
  end_datetime: z.string().min(1, '終了日時を入力してください'),
  car_id: z.number({ required_error: '車両を選択してください' }),
  destination: z.string().min(1, '行先を入力してください'),
  purpose: z.string().min(1, '目的を入力してください'),
}).refine(
  (v) => !v.start_datetime || !v.end_datetime || new Date(v.end_datetime) > new Date(v.start_datetime),
  { message: '終了日時は開始日時より後にしてください', path: ['end_datetime'] }
)
```

---

## shadcn 追加

`npx shadcn add calendar popover` で DatePicker 用コンポーネントを追加。

---

## 型定義追加

```typescript
export interface CarOut {
  id: number
  name: string
  plate_number: string
  model: string | null
  capacity: number
  is_available: boolean
  total_mileage: number
}

export interface ReservationCreateRequest {
  car_id: number
  start_datetime: string
  end_datetime: string
  destination: string
  purpose: string
  note?: string
}
```
