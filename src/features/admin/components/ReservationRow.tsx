'use client'

import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { useApproveReservation } from '@/features/dashboard/hooks/useApproveReservation'
import type { ReservationDetail } from '@/types'

function formatDatetime(dt: string) {
  return new Date(dt).toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ReservationRow({ reservation: r }: { reservation: ReservationDetail }) {
  const { mutate, isPending } = useApproveReservation()

  return (
    <div className="border rounded-md p-3 space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <p className="font-medium">{r.user_name}</p>
        <StatusBadge status={r.status} />
      </div>
      <p className="text-gray-500">{r.car_name} → {r.destination}</p>
      <p className="text-gray-400">
        {formatDatetime(r.start_datetime)} 〜 {formatDatetime(r.end_datetime)}
      </p>
      {r.purpose && <p className="text-gray-500">目的: {r.purpose}</p>}
      {r.status === 'pending' && (
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
      )}
    </div>
  )
}
