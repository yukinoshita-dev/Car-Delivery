'use client'

import { usePendingApprovals } from '@/features/dashboard/hooks/usePendingApprovals'
import { ReservationRow } from '@/features/admin/components/ReservationRow'

export default function AdminApprovalsPage() {
  const { data, isLoading } = usePendingApprovals()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">承認待ち一覧</h1>
      {isLoading ? (
        <p className="text-sm text-gray-400">読み込み中...</p>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-gray-500">承認待ちの申請はありません</p>
      ) : (
        <div className="space-y-3">
          {data.map((r) => (
            <ReservationRow key={r.id} reservation={r} />
          ))}
        </div>
      )}
    </div>
  )
}
