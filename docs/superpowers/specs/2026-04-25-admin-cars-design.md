# 管理者 車両管理ページ 設計ドキュメント (Plan 7)

## 概要
管理者が車両を一覧・追加・編集・削除できるページを実装する。

---

## バックエンド変更

なし。既存エンドポイントで対応:
- `GET /cars/` — 全車両一覧
- `POST /cars/` — 車両作成
- `PUT /cars/{id}` — 車両更新
- `DELETE /cars/{id}` — 車両削除

---

## フロントエンド構成

```
features/admin/
├── hooks/
│   ├── useCars.ts              GET /cars/
│   └── useCarMutations.ts      useCreateCar / useUpdateCar / useDeleteCar
└── components/
    ├── CarTable.tsx             テーブル一覧（編集・削除ボタン付き）
    └── CarFormModal.tsx         shadcn Dialog + react-hook-form + zod（Create/Edit 共用）

app/(app)/admin/
└── cars/page.tsx               「車両追加」ボタン + CarTable

src/types/index.ts              CarCreate・CarUpdate 型を追加
src/components/ui/
├── dialog.tsx                  shadcn add dialog
└── alert-dialog.tsx            shadcn add alert-dialog
```

---

## 型

`src/types/index.ts` に追加:

```typescript
export interface CarCreate {
  name: string
  plate_number: string
  model?: string
  capacity?: number
}

export interface CarUpdate {
  name?: string
  model?: string
  capacity?: number
  is_available?: boolean
}
```

既存の `CarOut` をそのまま利用。

---

## フック詳細

### `useCars`
```typescript
export function useCars() {
  return useQuery({
    queryKey: ['cars'],
    queryFn: () => apiClient.get<CarOut[]>('/cars/'),
  })
}
```

### `useCarMutations`
```typescript
export function useCreateCar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CarCreate) => apiClient.post<CarOut>('/cars/', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cars'] }),
  })
}

export function useUpdateCar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CarUpdate }) =>
      apiClient.put<CarOut>(`/cars/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cars'] }),
  })
}

export function useDeleteCar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/cars/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cars'] }),
  })
}
```

※ `apiClient.delete` は実装済み。ただし `DELETE /cars/{id}` は 204 No Content を返すため、`src/lib/api.ts` の `request` 関数を以下のように修正する:

```typescript
if (res.status === 204) return undefined as T
return res.json() as Promise<T>
```

---

## コンポーネント詳細

### `CarTable`

表示列:
- 車両名 (`name`)
- ナンバー (`plate_number`)
- 車種 (`model` — 未設定は「−」)
- 定員 (`capacity` 名)
- 状態 (`is_available` → 「利用可」青バッジ / 「利用不可」赤バッジ)
- 操作列: 編集ボタン・削除ボタン

削除ボタン → shadcn `AlertDialog`（「この車両を削除しますか？」確認） → `useDeleteCar` 実行

### `CarFormModal`

props:
```typescript
{
  open: boolean
  onOpenChange: (open: boolean) => void
  car?: CarOut   // undefined → Create モード、あり → Edit モード
}
```

- shadcn `Dialog` を使用
- Create 入力項目: 車両名（必須）、ナンバー（必須）、車種（任意）、定員（任意・数値・デフォルト5）
- Edit 入力項目: 車両名、車種、定員、利用可否（チェックボックス） — ナンバーは読み取り専用で表示
- バリデーション (Zod):
  - `name`: `z.string().min(1, '車両名を入力してください')`
  - `plate_number` (Createのみ): `z.string().min(1, 'ナンバーを入力してください')`
  - `capacity`: `z.number({ invalid_type_error: '定員を入力してください' }).int().positive('正の整数を入力してください').optional()`
- 送信成功 → `onOpenChange(false)` でモーダルを閉じる

---

## ページ詳細

### `/admin/cars`

```tsx
// 状態
const [modalOpen, setModalOpen] = useState(false)
const [editTarget, setEditTarget] = useState<CarOut | undefined>()

// 操作
// 「車両追加」ボタン → setEditTarget(undefined); setModalOpen(true)
// 編集ボタン → setEditTarget(car); setModalOpen(true)
```

- `useCars` で一覧取得
- `CarTable` に渡す
- `CarFormModal` を配置（open/onOpenChange/car を渡す）

---

## テスト

```typescript
// __tests__/features/admin/cars-hooks.test.ts
// - GET /cars/ を呼ぶ
// - POST /cars/ を呼ぶ（useCreateCar）
// - DELETE /cars/1 を呼ぶ（useDeleteCar）

// __tests__/features/admin/CarFormModal.test.tsx
// - Create モード: 入力欄（車両名・ナンバー）が表示される
// - Create モード: 車両名を空にして送信 → バリデーションエラー表示
```
