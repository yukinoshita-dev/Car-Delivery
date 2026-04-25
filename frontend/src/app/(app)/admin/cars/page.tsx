'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCars } from '@/features/admin/hooks/useCars'
import { CarTable } from '@/features/admin/components/CarTable'
import { CarFormModal } from '@/features/admin/components/CarFormModal'
import type { CarOut } from '@/types'

export default function AdminCarsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<CarOut | undefined>()
  const { data: cars, isLoading } = useCars()

  function openCreate() {
    setEditTarget(undefined)
    setModalOpen(true)
  }

  function openEdit(car: CarOut) {
    setEditTarget(car)
    setModalOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">車両管理</h1>
        <Button onClick={openCreate}>車両追加</Button>
      </div>
      {isLoading ? (
        <p className="text-sm text-gray-400">読み込み中...</p>
      ) : (
        <CarTable cars={cars ?? []} onEdit={openEdit} />
      )}
      <CarFormModal
        key={editTarget?.id ?? 'new'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        car={editTarget}
      />
    </div>
  )
}
