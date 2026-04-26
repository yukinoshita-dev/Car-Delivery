'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCarUsage } from '@/features/dashboard/hooks/useCarUsage'

export function CarUsageChart() {
  const { data, isLoading } = useCarUsage()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">車両別予約件数</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <div className="h-48 animate-pulse bg-gray-100 rounded" />
        ) : data.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">データがありません</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="car" tick={{ fontSize: 11 }} width={80} />
              <Tooltip
                formatter={(value) => [`${value} 件`, '予約数']}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
