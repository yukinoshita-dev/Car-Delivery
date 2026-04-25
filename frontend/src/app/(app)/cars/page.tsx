'use client'

import { useCars } from '@/features/cars/hooks/useCars'
import { CarCard } from '@/features/cars/components/CarCard'

export default function CarsPage() {
  const { data: cars, isLoading } = useCars()

  if (isLoading) return <p className="text-sm text-gray-400">読み込み中...</p>
  if (!cars || cars.length === 0) return <p className="text-sm text-gray-500">登録された車両がありません</p>

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">車両一覧</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  )
}
