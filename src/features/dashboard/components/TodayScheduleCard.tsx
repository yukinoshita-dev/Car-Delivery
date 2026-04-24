import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { useTodaySchedule } from '@/features/dashboard/hooks/useTodaySchedule'

function formatTime(dt: string) {
  return new Date(dt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
}

export function TodayScheduleCard() {
  const { data, isLoading } = useTodaySchedule()

  return (
    <Card>
      <CardHeader>
        <CardTitle>今日の配車状況</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-gray-400">読み込み中...</p>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-gray-500">本日の配車はありません</p>
        ) : (
          <div className="space-y-3">
            {data.map((r) => (
              <div
                key={r.id}
                className="flex items-start justify-between gap-2 text-sm border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="font-medium">{r.car_name}</p>
                  <p className="text-gray-500 truncate">{r.user_name} → {r.destination}</p>
                  <p className="text-gray-400">{formatTime(r.start_datetime)} 〜 {formatTime(r.end_datetime)}</p>
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
