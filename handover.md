# CarDelivery handover

## 概要
社用車の予約・配車管理システム。ポートフォリオ用。
管理者と一般ユーザーのロール分けあり（デモ用ダミーログイン）。

## 技術スタック
- Backend: Python / FastAPI / PostgreSQL / Alembic / JWT認証 / python-jose
- Frontend: Next.js 15 / TypeScript / Tailwind CSS / shadcn/ui / TanStack Query v5 / Zustand v5 / react-hook-form + Zod
- Deploy: AWS App Runner（バックエンド）/ Amplify or Vercel（フロント）

## 現在のステータス
**Plan 5（配車予約申請）完了。Plan 6（管理者：予約管理）が次。**

## デモアカウント
```
一般社員: user@demo.com / demo
管理者:   admin@demo.com / demo
```

## 完了済み Plan 一覧
- Plan 1: 基盤 ✅
- Plan 2: 認証 ✅
- Plan 3: レイアウト ✅（折りたたみサイドバー・ヘッダー・UserDropdown）
- Plan 4: ダッシュボード ✅
- Plan 5: 配車予約申請フォーム ✅

## Plan 5 完了内容
### バックエンド
- `backend/app/api/v1/endpoints/cars.py`: `GET /available?start=&end=` 追加（競合予約のない車両のみ返す）
- `backend/app/schemas/reservation.py`: `ReservationCreate` から `user_id` フィールドを削除
- `backend/app/api/v1/endpoints/reservations.py`: `POST /` に `get_current_email` dependency 追加・JWT から user_id を自動設定

### フロントエンド
- `src/types/index.ts`: `CarOut` / `ReservationCreateRequest` 型追加
- `src/components/ui/calendar.tsx` / `popover.tsx`: shadcn add で追加
- `src/features/reservations/hooks/useAvailableCars.ts`: GET /cars/available フック
- `src/features/reservations/hooks/useCreateReservation.ts`: POST /reservations/ フック
- `src/features/reservations/components/DateTimePicker.tsx`: shadcn Calendar + 時刻 Select
- `src/features/reservations/components/ReservationForm.tsx`: react-hook-form + zod フォーム全体
- `src/app/(app)/reservations/new/page.tsx`: 予約申請ページ
- テスト: hooks.test.ts（3件）+ ReservationForm.test.tsx（2件）= 全30テスト通過

## Plan 4 完了内容
### バックエンド
- `backend/seed.py`: デモ用データ投入スクリプト（ユーザー2・車両2・予約6件）
- `backend/app/schemas/reservation.py`: `TodayReservationOut` / `ReservationDetail` 追加
- `backend/app/api/v1/endpoints/dashboard.py`: `/today` を joinedload で car_name/user_name/user_email 返却に修正
- `backend/app/api/v1/endpoints/reservations.py`: `/me` エンドポイント追加・list を `ReservationDetail` に更新
- `backend/app/services/auth_service.py`: `get_current_email` 追加

### フロントエンド
- `src/types/index.ts`: `TodayReservation` / `ReservationDetail` / `DashboardStats` 追加
- `src/components/ui/status-badge.tsx`: ステータスバッジ（5色）
- `src/features/dashboard/hooks/`: 5フック（useTodaySchedule / useMyReservations / usePendingApprovals / useDashboardStats / useApproveReservation）
- `src/features/dashboard/components/`: StatsCards / TodayScheduleCard / MyReservationsCard / PendingApprovalsCard
- `src/app/(app)/dashboard/page.tsx`: role別レイアウト
- 全25テスト通過

## 次（Plan 6: 管理者 — 予約管理）
- 管理者が全予約を一覧・承認・却下できるページ
- `/reservations` ページ（管理者専用）
- ステータスフィルタリング
- 承認・却下アクション

## Plan ファイル一覧
- `docs/superpowers/plans/2026-04-23-01-foundation.md` Plan 1
- `docs/superpowers/plans/2026-04-24-02-auth.md` Plan 2
- `docs/superpowers/plans/2026-04-25-03-layout.md` Plan 3
- `docs/superpowers/plans/2026-04-25-04-dashboard.md` Plan 4
- `docs/superpowers/plans/2026-04-25-05-reservation-form.md` Plan 5

## ローカル実行
```bash
# バックエンド
cd F:/business/My/portfolio/CarDelivery/backend
source venv/Scripts/activate
python seed.py          # 初回のみ
uvicorn app.main:app --reload

# フロントエンド
cd F:/business/My/portfolio/CarDelivery/frontend
npm run dev
```

## テスト実行
```bash
cd F:/business/My/portfolio/CarDelivery/frontend
npm run test:run
```

## メモ
- middleware はJWTのbase64デコードでroleを確認（署名検証なし・デモ用途のため）
- `/reservations/me` は JWT から email を取得し users テーブルで照合してフィルタ
- `GET /cars/available` は pending/approved/in_progress の予約と重複しない車両のみ返す
- CarDeliveryPJは確認なしで自律的に作業を進める
