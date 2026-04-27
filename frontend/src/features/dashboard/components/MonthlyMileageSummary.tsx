'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ReportRow {
  user_id: number
  name: string
  email: string
  total_km: number
  allowance: number
}

interface ReportResponse {
  year: number
  month: number
  report: ReportRow[]
}

export function MonthlyMileageSummary() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1

  const { data, isLoading, error } = useQuery({
    queryKey: ['mileage-report-monthly', year, month],
    queryFn: () =>
      apiClient.get<ReportResponse>(`/mileage-report/monthly?year=${year}&month=${month}`),
  })

  const maxKm = data?.report.length ? Math.max(...data.report.map((r) => r.total_km)) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {year}年{month}月 ユーザー別走行距離
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-gray-400">読み込み中...</p>
        ) : error ? (
          <p className="text-sm text-red-500">取得に失敗しました</p>
        ) : !data || data.report.length === 0 ? (
          <p className="text-sm text-gray-500">今月の走行記録はありません</p>
        ) : (
          <div className="space-y-3">
            {data.report.map((row, i) => {
              const pct = maxKm > 0 ? (row.total_km / maxKm) * 100 : 0
              const barColor =
                i === 0 ? 'bg-blue-500' :
                i === 1 ? 'bg-blue-400' :
                'bg-blue-300'
              return (
                <div key={row.user_id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-800">{row.name}</span>
                    <span className="font-bold text-gray-700">{row.total_km.toFixed(1)} km</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
