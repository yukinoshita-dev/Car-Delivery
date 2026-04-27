'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiClient } from '@/lib/api'

interface AvailabilityResult {
  date: string
  total_cars: number
  reserved_count: number
  available_count: number
}

export function AvailabilityChecker() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [result, setResult] = useState<AvailabilityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const check = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiClient.get<AvailabilityResult>(`/dashboard/availability?date=${date}`)
      setResult(data)
    } catch {
      setError('取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const ratio = result
    ? `${result.reserved_count} / ${result.total_cars}`
    : null

  return (
    <Card>
      <CardHeader>
        <CardTitle>日別予約状況確認</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-3">
          <div className="space-y-1 flex-1">
            <Label htmlFor="avail-date">日付</Label>
            <Input
              id="avail-date"
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setResult(null) }}
            />
          </div>
          <Button onClick={check} disabled={loading}>
            {loading ? '確認中...' : '確認'}
          </Button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {result && (
          <div className="rounded-md border p-4 space-y-2 text-sm">
            <p className="text-gray-500">{result.date} の予約状況</p>
            <div className="flex gap-6">
              <div>
                <p className="text-2xl font-bold text-blue-600">{result.available_count}</p>
                <p className="text-gray-500">予約可能台数</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{result.reserved_count}</p>
                <p className="text-gray-500">予約済み台数</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-700">{result.total_cars}</p>
                <p className="text-gray-500">利用可能車両総数</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: result.total_cars > 0 ? `${(result.reserved_count / result.total_cars) * 100}%` : '0%' }}
              />
            </div>
            <p className="text-xs text-gray-400">予約済み {ratio}台</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
