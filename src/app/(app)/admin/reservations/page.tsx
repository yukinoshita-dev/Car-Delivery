'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAllReservations } from '@/features/admin/hooks/useAllReservations'
import { ReservationRow } from '@/features/admin/components/ReservationRow'
import type { ReservationStatus } from '@/types'

const TABS: { label: string; value: string; status?: ReservationStatus }[] = [
  { label: '全て',     value: 'all' },
  { label: '承認待ち', value: 'pending',     status: 'pending' },
  { label: '承認済み', value: 'approved',    status: 'approved' },
  { label: '進行中',   value: 'in_progress', status: 'in_progress' },
  { label: '完了',     value: 'completed',   status: 'completed' },
  { label: 'キャンセル', value: 'cancelled', status: 'cancelled' },
]

function ReservationList({ status }: { status?: string }) {
  const { data, isLoading } = useAllReservations(status)

  if (isLoading) return <p className="text-sm text-gray-400">読み込み中...</p>
  if (!data || data.length === 0) return <p className="text-sm text-gray-500">予約はありません</p>
  return (
    <div className="space-y-3">
      {data.map((r) => (
        <ReservationRow key={r.id} reservation={r} />
      ))}
    </div>
  )
}

export default function AdminReservationsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">予約一覧</h1>
      <Tabs defaultValue="all">
        <TabsList className="flex-wrap h-auto">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <ReservationList status={tab.status} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
