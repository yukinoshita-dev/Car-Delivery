'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/ui/status-badge'
import { useCompleteMyReservation } from '@/features/reservations/hooks/useCompleteMyReservation'
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
  const { mutate: complete, isPending } = useCompleteMyReservation()
  const [showInput, setShowInput] = useState(false)
  const [mileage, setMileage] = useState('')

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
      {r.rejection_reason && (
        <p className="text-red-500 text-xs bg-red-50 px-2 py-1 rounded">却下理由: {r.rejection_reason}</p>
      )}
      {r.status === 'in_progress' && (
        <div className="pt-1">
          {showInput ? (
            <div className="flex flex-wrap gap-2 items-center">
              <Input
                type="number"
                min="0"
                placeholder="走行距離 (km)"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="h-8 w-36 text-sm"
              />
              <Button
                size="sm"
                onClick={() => {
                  complete(
                    { id: r.id, mileage_used: mileage ? parseFloat(mileage) : 0 },
                    { onSuccess: () => { setShowInput(false); setMileage('') } },
                  )
                }}
                disabled={isPending}
              >
                {isPending ? '送信中...' : '完了報告'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setShowInput(false); setMileage('') }}
                disabled={isPending}
              >
                キャンセル
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowInput(true)}
            >
              使用完了を報告する
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
