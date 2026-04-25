'use client'

import { StatusBadge } from '@/components/ui/status-badge'
import type { ReservationDetail } from '@/types'

function formatDatetime(dt: string) {
  return new Date(dt).toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MyReservationRow({ reservation: r }: { reservation: ReservationDetail }) {
  return (
    <div className="border rounded-md p-3 space-y-1 text-sm">
      <div className="flex items-center justify-between">
        <p className="font-medium">{r.car_name}</p>
        <StatusBadge status={r.status} />
      </div>
      <p className="text-gray-500">行先: {r.destination}</p>
      <p className="text-gray-400">
        {formatDatetime(r.start_datetime)} 〜 {formatDatetime(r.end_datetime)}
      </p>
      {r.purpose && <p className="text-gray-500">目的: {r.purpose}</p>}
      {r.mileage_used > 0 && <p className="text-gray-400">走行距離: {r.mileage_used} km</p>}
    </div>
  )
}
