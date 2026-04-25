'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useCreateCar, useUpdateCar } from '@/features/admin/hooks/useCarMutations'
import type { CarOut } from '@/types'

const capacityField = z.preprocess(
  (val) => (val === '' || val == null ? undefined : Number(val)),
  z
    .number({ error: '数値を入力してください' })
    .int()
    .positive('正の整数を入力してください')
    .optional()
)

const createSchema = z.object({
  name: z.string().min(1, '車両名を入力してください'),
  plate_number: z.string().min(1, 'ナンバーを入力してください'),
  model: z.string().optional(),
  capacity: capacityField,
})
type CreateValues = z.infer<typeof createSchema>

const editSchema = z.object({
  name: z.string().min(1, '車両名を入力してください'),
  model: z.string().optional(),
  capacity: capacityField,
  is_available: z.boolean().optional(),
})
type EditValues = z.infer<typeof editSchema>

function CreateForm({ onClose }: { onClose: () => void }) {
  const { mutate, isPending } = useCreateCar()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateValues>({ resolver: zodResolver(createSchema) })

  return (
    <form onSubmit={handleSubmit((data) => mutate(data, { onSuccess: onClose }))} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">車両名</Label>
        <Input id="name" {...register('name')} placeholder="例: プリウス1号" />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="plate_number">ナンバー</Label>
        <Input id="plate_number" {...register('plate_number')} placeholder="例: 品川300あ1234" />
        {errors.plate_number && <p className="text-sm text-red-500">{errors.plate_number.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="model">車種（任意）</Label>
        <Input id="model" {...register('model')} placeholder="例: Toyota Prius" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="capacity">定員（任意）</Label>
        <Input id="capacity" {...register('capacity')} type="number" min={1} placeholder="5" />
        {errors.capacity && <p className="text-sm text-red-500">{errors.capacity.message}</p>}
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
    watch,
  } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: car.name,
      model: car.model ?? '',
      capacity: car.capacity,
      is_available: car.is_available,
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
        <Label htmlFor="model">車種（任意）</Label>
        <Input id="model" {...register('model')} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="capacity">定員（任意）</Label>
        <Input id="capacity" {...register('capacity')} type="number" min={1} />
        {errors.capacity && <p className="text-sm text-red-500">{errors.capacity.message}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="is_available"
          checked={watch('is_available') ?? car.is_available}
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
