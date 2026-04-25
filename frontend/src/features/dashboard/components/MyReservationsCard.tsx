import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { useMyReservations } from '@/features/dashboard/hooks/useMyReservations'

function formatDate(dt: string) {
  return new Date(dt).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
}

export function MyReservationsCard() {
  const { data, isLoading } = useMyReservations()

  return (
    <Card>
      <CardHeader>
        <CardTitle>自分の予約履歴</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-gray-400">読み込み中...</p>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-gray-500">予約履歴がありません</p>
        ) : (
          <div className="space-y-3">
            {data.map((r) => (
              <div
                key={r.id}
                className="flex items-start justify-between gap-2 text-sm border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="font-medium truncate">{r.destination}</p>
                  <p className="text-gray-500">{r.car_name}</p>
                  <p className="text-gray-400">{formatDate(r.start_datetime)}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
