'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { usePendingMileage } from '@/features/reservations/hooks/usePendingMileage'
import { useSubmitMileage } from '@/features/reservations/hooks/useSubmitMileage'
import type { ReservationDetail } from '@/types'

function formatDate(dt: string) {
  return new Date(dt).toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function MileageRow({ r }: { r: ReservationDetail }) {
  const [mileage, setMileage] = useState(String(r.car_total_mileage))
  const [notUsed, setNotUsed] = useState(false)
  const { mutate, isPending } = useSubmitMileage()

  const handleSubmit = () => {
    mutate({
      id: r.id,
      not_used: notUsed,
      mileage_used: notUsed ? undefined : parseFloat(mileage) || 0,
    })
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-3 text-sm">
        <div className="space-y-0.5">
          <p className="font-medium">{r.car_name}</p>
          <p className="text-gray-500">{r.destination}</p>
          <p className="text-gray-400">{formatDate(r.start_datetime)} 〜 {formatDate(r.end_datetime)}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`not-used-${r.id}`}
              checked={notUsed}
              onChange={(e) => setNotUsed(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor={`not-used-${r.id}`} className="text-gray-700">使わなかった</label>
          </div>
          {!notUsed && (
            <div className="space-y-1">
              <p className="text-xs text-gray-400">使用後の累計走行距離を入力してください</p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="h-8 w-40 text-sm"
                />
                <span className="text-gray-500 text-xs">km</span>
              </div>
            </div>
          )}
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isPending || (!notUsed && !mileage)}
          >
            {isPending ? '送信中...' : '記録する'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MileageInputPage() {
  const { data, isLoading } = usePendingMileage()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">走行記録入力</h1>
      <p className="text-sm text-gray-500">予約終了後に走行距離を記録してください。</p>

      {isLoading ? (
        <p className="text-sm text-gray-400">読み込み中...</p>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-gray-500">入力待ちの予約はありません</p>
      ) : (
        <div className="space-y-3">
          {data.map((r) => (
            <MileageRow key={r.id} r={r} />
          ))}
        </div>
      )}
    </div>
  )
}
