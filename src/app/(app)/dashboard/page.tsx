'use client'

import { useAuthStore } from '@/features/auth/store'
import { StatsCards } from '@/features/dashboard/components/StatsCards'
import { TodayScheduleCard } from '@/features/dashboard/components/TodayScheduleCard'
import { MyReservationsCard } from '@/features/dashboard/components/MyReservationsCard'
import { PendingApprovalsCard } from '@/features/dashboard/components/PendingApprovalsCard'

export default function DashboardPage() {
  const { role } = useAuthStore()

  if (role === 'admin') {
    return (
      <div className="space-y-6">
        <StatsCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TodayScheduleCard />
          <PendingApprovalsCard />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TodayScheduleCard />
      <MyReservationsCard />
    </div>
  )
}
