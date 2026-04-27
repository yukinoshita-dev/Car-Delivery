'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMyReservations } from '@/features/reservations/hooks/useMyReservations'
import { MyReservationRow } from '@/features/reservations/components/MyReservationRow'
import type { ReservationStatus } from '@/types'

const TABS: { label: string; value: string; status?: ReservationStatus }[] = [
  { label: '承認待ち',  value: 'pending',     status: 'pending' },
  { label: '承認済み',  value: 'approved',    status: 'approved' },
  { label: '使用中',    value: 'in_progress', status: 'in_progress' },
  { label: '完了',      value: 'completed',   status: 'completed' },
  { label: 'キャンセル', value: 'cancelled',  status: 'cancelled' },
  { label: '全て',       value: 'all' },
]

function ReservationList({ status }: { status?: ReservationStatus }) {
  const { data, isLoading } = useMyReservations()

  if (isLoading) return <p className="text-sm text-gray-400">読み込み中...</p>

  const filtered = status ? (data ?? []).filter((r) => r.status === status) : (data ?? [])

  if (filtered.length === 0) return <p className="text-sm text-gray-500">予約はありません</p>

  return (
    <div className="space-y-3">
      {filtered.map((r) => (
        <MyReservationRow key={r.id} reservation={r} />
      ))}
    </div>
  )
}

export default function MyReservationsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">自分の予約一覧</h1>
      <Tabs defaultValue="pending">
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
