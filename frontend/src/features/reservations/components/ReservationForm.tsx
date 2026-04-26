'use client'

import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DateTimePicker } from './DateTimePicker'
import { useAvailableCars } from '@/features/reservations/hooks/useAvailableCars'
import { useCreateReservation } from '@/features/reservations/hooks/useCreateReservation'

const schema = z
  .object({
    start_datetime: z.string().min(1, '開始日時を入力してください'),
    end_datetime: z.string().min(1, '終了日時を入力してください'),
    car_id: z.number({ error: '車両を選択してください' }),
    destination: z.string().min(1, '行先を入力してください'),
    purpose: z.string().min(1, '目的を入力してください'),
    note: z.string().optional(),
  })
  .refine(
    (v) =>
      !v.start_datetime ||
      !v.end_datetime ||
      new Date(v.end_datetime) > new Date(v.start_datetime),
    { message: '終了日時は開始日時より後にしてください', path: ['end_datetime'] }
  )

type FormValues = z.infer<typeof schema>

export function ReservationForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const startDatetime = watch('start_datetime')
  const endDatetime = watch('end_datetime')
  const { data: availableCars, isLoading: carsLoading } = useAvailableCars(
    startDatetime || null,
    endDatetime || null
  )
  const { mutate, isPending, isError, error } = useCreateReservation()

  function onSubmit(data: FormValues) {
    mutate(
      { ...data },
      { onSuccess: () => router.push('/dashboard') }
    )
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>配車予約申請</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <Label>開始日時</Label>
            <Controller
              name="start_datetime"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <DateTimePicker value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.start_datetime && (
              <p className="text-sm text-red-500">{errors.start_datetime.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>終了日時</Label>
            <Controller
              name="end_datetime"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <DateTimePicker value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.end_datetime && (
              <p className="text-sm text-red-500">{errors.end_datetime.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>車両</Label>
            <Controller
              name="car_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(v) => field.onChange(Number(v))}
                  disabled={!startDatetime || !endDatetime || carsLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !startDatetime || !endDatetime
                          ? '先に日時を入力してください'
                          : carsLoading
                          ? '読み込み中...'
                          : availableCars?.length === 0
                          ? '空き車両なし'
                          : '車両を選択'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCars?.map((car) => (
                      <SelectItem key={car.id} value={String(car.id)}>
                        {car.name}（定員 {car.capacity}名）
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.car_id && (
              <p className="text-sm text-red-500">{errors.car_id.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="destination">行先</Label>
            <Input id="destination" placeholder="例: 新宿区役所" {...register('destination')} />
            {errors.destination && (
              <p className="text-sm text-red-500">{errors.destination.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="purpose">目的</Label>
            <Input id="purpose" placeholder="例: 書類提出" {...register('purpose')} />
            {errors.purpose && (
              <p className="text-sm text-red-500">{errors.purpose.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="note">備考（任意）</Label>
            <Input id="note" placeholder="任意" {...register('note')} />
          </div>

          {isError && (
            <p className="text-sm text-red-500">
              {error instanceof Error ? error.message : '申請に失敗しました'}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? '申請中...' : '申請する'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
