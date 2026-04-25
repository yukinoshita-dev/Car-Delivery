'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteCar } from '@/features/admin/hooks/useCarMutations'
import type { CarOut } from '@/types'

interface Props {
  cars: CarOut[]
  onEdit: (car: CarOut) => void
}

export function CarTable({ cars, onEdit }: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { mutate: deleteCar, isPending: isDeleting } = useDeleteCar()

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">車両名</th>
              <th className="text-left px-4 py-3">ナンバー</th>
              <th className="text-left px-4 py-3">定員</th>
              <th className="text-left px-4 py-3">状態</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {cars.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                  車両が登録されていません
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{car.name}</td>
                  <td className="px-4 py-3 text-gray-500">{car.plate_number}</td>
                  <td className="px-4 py-3">{car.capacity}名</td>
                  <td className="px-4 py-3">
                    {car.is_available ? (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-0">利用可</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">利用不可</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => onEdit(car)}>
                        編集
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setDeletingId(car.id)}
                      >
                        削除
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(open) => { if (!open) setDeletingId(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>この車両を削除しますか？</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
              onClick={() => {
                if (deletingId !== null) {
                  deleteCar(deletingId, { onSuccess: () => setDeletingId(null) })
                }
              }}
            >
              {isDeleting ? '削除中...' : '削除する'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
