'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/ui/status-badge'
import { useApproveReservation } from '@/features/dashboard/hooks/useApproveReservation'
import { useUpdateReservationStatus } from '@/features/admin/hooks/useUpdateReservationStatus'
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
  const { mutate: approve, isPending: isApproving } = useApproveReservation()
  const { mutate: update, isPending: isUpdating } = useUpdateReservationStatus()
  const [showMileageInput, setShowMileageInput] = useState(false)
  const [mileage, setMileage] = useState('')

  const isPending = isApproving || isUpdating

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
            onClick={() => approve({ id: r.id, status: 'approved' })}
            disabled={isPending}
          >
            承認
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => approve({ id: r.id, status: 'cancelled' })}
            disabled={isPending}
          >
            却下
          </Button>
        </div>
      )}
      {r.status === 'approved' && (
        <div className="pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => update({ id: r.id, status: 'in_progress' })}
            disabled={isPending}
          >
            進行中に変更
          </Button>
        </div>
      )}
      {r.status === 'in_progress' && (
        <div className="pt-1">
          {showMileageInput ? (
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
                  update({
                    id: r.id,
                    status: 'completed',
                    mileage_used: mileage ? parseFloat(mileage) : 0,
                  })
                  setShowMileageInput(false)
                  setMileage('')
                }}
                disabled={isPending}
              >
                確定
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setShowMileageInput(false); setMileage('') }}
                disabled={isPending}
              >
                キャンセル
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowMileageInput(true)}
              disabled={isPending}
            >
              完了にする
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
