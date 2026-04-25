'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePendingApprovals } from '@/features/dashboard/hooks/usePendingApprovals'
import { useApproveReservation } from '@/features/dashboard/hooks/useApproveReservation'

function formatDatetime(dt: string) {
  return new Date(dt).toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function PendingApprovalsCard() {
  const { data, isLoading } = usePendingApprovals()
  const { mutate, isPending } = useApproveReservation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          承認待ち
          {data && data.length > 0 && (
            <span className="ml-2 text-sm font-normal text-yellow-600">({data.length}件)</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-gray-400">読み込み中...</p>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-gray-500">承認待ちの申請はありません</p>
        ) : (
          <div className="space-y-4">
            {data.map((r) => (
              <div key={r.id} className="border rounded-md p-3 space-y-2 text-sm">
                <div className="space-y-0.5">
                  <p className="font-medium">{r.user_name}</p>
                  <p className="text-gray-500">{r.car_name} → {r.destination}</p>
                  <p className="text-gray-400">
                    {formatDatetime(r.start_datetime)} 〜 {formatDatetime(r.end_datetime)}
                  </p>
                  {r.purpose && <p className="text-gray-500">目的: {r.purpose}</p>}
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={() => mutate({ id: r.id, status: 'approved' })}
                    disabled={isPending}
                  >
                    承認
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => mutate({ id: r.id, status: 'cancelled' })}
                    disabled={isPending}
                  >
                    却下
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
