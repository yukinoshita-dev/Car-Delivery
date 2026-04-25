'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CarOut } from '@/types'

export function CarCard({ car }: { car: CarOut }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{car.name}</CardTitle>
          {car.is_available ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0">空き</Badge>
          ) : (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">使用不可</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-gray-600">
        <p>ナンバー: {car.plate_number}</p>
        {car.model && <p>車種: {car.model}</p>}
        <p>定員: {car.capacity}名</p>
        <p>累計走行距離: {car.total_mileage.toLocaleString()} km</p>
      </CardContent>
    </Card>
  )
}
