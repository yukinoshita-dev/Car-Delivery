import { Card, CardContent } from '@/components/ui/card'
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats'
import { Car, CheckCircle, Clock, Wrench } from 'lucide-react'

export function StatsCards() {
  const { data, isLoading } = useDashboardStats()

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 h-24 animate-pulse bg-gray-100 rounded-lg" />
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    { label: '車両総数', value: data.total_cars,                        icon: Car,         color: 'text-blue-600' },
    { label: '利用可能', value: data.available_cars,                    icon: CheckCircle, color: 'text-green-600' },
    { label: '使用中',   value: data.in_use_cars,                       icon: Wrench,      color: 'text-yellow-600' },
    { label: '今月完了', value: data.completed_reservations_this_month, icon: Clock,       color: 'text-purple-600' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <CardContent className="p-6 flex items-center gap-4">
            <Icon className={`h-8 w-8 ${color} shrink-0`} />
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
