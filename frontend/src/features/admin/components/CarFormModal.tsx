'use client'

import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useCreateCar, useUpdateCar } from '@/features/admin/hooks/useCarMutations'
import type { CarOut } from '@/types'

const numField = z
  .number({ error: '数値を入力してください' })
  .int()
  .min(0, '0以上の整数を入力してください')
  .optional()

const capacityField = z
  .number({ error: '数値を入力してください' })
  .int()
  .positive('正の整数を入力してください')
  .optional()

const createSchema = z.object({
  name: z.string().min(1, '識別名を入力してください'),
  plate_number: z.string().min(1, 'ナンバーを入力してください'),
  model: z.string().optional(),
  capacity: capacityField,
  total_mileage: numField,
})
type CreateValues = z.infer<typeof createSchema>

const editSchema = z.object({
  name: z.string().min(1, '識別名を入力してください'),
  model: z.string().optional(),
  capacity: capacityField,
  is_available: z.boolean().optional(),
  total_mileage: numField,
})
type EditValues = z.infer<typeof editSchema>

const numSetValue = (v: unknown) => (v === '' || v == null ? undefined : Number(v))

function CreateForm({ onClose }: { onClose: () => void }) {
  const { mutate, isPending } = useCreateCar()
  const [apiError, setApiError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateValues>({ resolver: zodResolver(createSchema) })

  const onSubmit = (data: CreateValues) => {
    setApiError(null)
    mutate(data, {
      onSuccess: onClose,
      onError: (err: unknown) => {
        const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        setApiError(msg ?? '登録に失敗しました')
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {apiError && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">{apiError}</p>}
      <div className="space-y-1">
        <Label htmlFor="name">識別名</Label>
        <Input id="name" {...register('name')} placeholder="例: プリウス1号（識別用の名前）" />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="plate_number">ナンバー</Label>
        <Input id="plate_number" {...register('plate_number')} placeholder="例: 品川300あ1234" />
        {errors.plate_number && <p className="text-sm text-red-500">{errors.plate_number.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="model">車種・型式（任意）</Label>
        <Input id="model" {...register('model')} placeholder="例: トヨタ プリウス" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="capacity">定員（任意）</Label>
        <Input id="capacity" {...register('capacity', { setValueAs: numSetValue })} type="number" min={1} placeholder="5" />
        {errors.capacity && <p className="text-sm text-red-500">{errors.capacity.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="total_mileage">累計走行距離 km（任意）</Label>
        <Input id="total_mileage" {...register('total_mileage', { setValueAs: numSetValue })} type="number" min={0} placeholder="0" />
        {errors.total_mileage && <p className="text-sm text-red-500">{errors.total_mileage.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? '保存中...' : '追加する'}
      </Button>
    </form>
  )
}

function EditForm({ car, onClose }: { car: CarOut; onClose: () => void }) {
  const { mutate, isPending } = useUpdateCar()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: car.name,
      model: car.model ?? '',
      capacity: car.capacity,
      is_available: car.is_available,
      total_mileage: car.total_mileage,
    },
  })

  return (
    <form
      onSubmit={handleSubmit((data) => mutate({ id: car.id, data }, { onSuccess: onClose }))}
      className="space-y-4"
    >
      <div className="space-y-1">
        <Label htmlFor="name">車両名</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-1">
        <Label>ナンバー</Label>
        <p className="text-sm text-gray-500 py-2 px-3 border rounded-md bg-gray-50">{car.plate_number}</p>
      </div>
      <div className="space-y-1">
        <Label htmlFor="model">車種・型式（任意）</Label>
        <Input id="model" {...register('model')} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="capacity">定員（任意）</Label>
        <Input id="capacity" {...register('capacity', { setValueAs: (v) => (v === '' || v == null ? undefined : Number(v)) })} type="number" min={1} />
        {errors.capacity && <p className="text-sm text-red-500">{errors.capacity.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="total_mileage_edit">累計走行距離 km</Label>
        <Input id="total_mileage_edit" {...register('total_mileage', { setValueAs: numSetValue })} type="number" min={0} />
        {errors.total_mileage && <p className="text-sm text-red-500">{errors.total_mileage.message}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="is_available"
          checked={useWatch({ control, name: 'is_available' }) ?? car.is_available}
          onCheckedChange={(checked) => setValue('is_available', !!checked)}
        />
        <Label htmlFor="is_available">利用可能</Label>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? '保存中...' : '更新する'}
      </Button>
    </form>
  )
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  car?: CarOut
}

export function CarFormModal({ open, onOpenChange, car }: Props) {
  const onClose = () => onOpenChange(false)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{car ? '車両編集' : '車両追加'}</DialogTitle>
        </DialogHeader>
        {car ? <EditForm car={car} onClose={onClose} /> : <CreateForm onClose={onClose} />}
      </DialogContent>
    </Dialog>
  )
}
