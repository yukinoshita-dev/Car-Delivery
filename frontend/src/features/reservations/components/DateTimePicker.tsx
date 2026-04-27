'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface DateTimePickerProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  minDate?: Date
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = ['00', '30']

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function DateTimePicker({ value, onChange, disabled, minDate }: DateTimePickerProps) {
  const [open, setOpen] = useState(false)

  const date = value ? new Date(value) : undefined
  const selectedHour = date ? String(date.getHours()).padStart(2, '0') : '09'
  const selectedMinute = date ? (date.getMinutes() >= 30 ? '30' : '00') : '00'

  // minDate と同日が選択されている場合、その時刻以降のみ有効
  const onMinDay = !!(date && minDate && isSameDay(date, minDate))
  const minHour = onMinDay ? minDate!.getHours() : 0
  const minMinute = onMinDay && parseInt(selectedHour) === minDate!.getHours()
    ? (minDate!.getMinutes() > 0 ? 30 : 0)
    : 0

  function handleDaySelect(day: Date | undefined) {
    if (!day) return
    let h = parseInt(selectedHour)
    let m = parseInt(selectedMinute)

    // minDate と同日なら時刻が minDate 以降になるよう補正
    if (minDate && isSameDay(day, minDate)) {
      if (h < minDate.getHours()) {
        h = minDate.getHours()
        m = minDate.getMinutes() > 0 ? 30 : 0
      } else if (h === minDate.getHours() && m < (minDate.getMinutes() > 0 ? 30 : 0)) {
        m = minDate.getMinutes() > 0 ? 30 : 0
      }
    }

    day.setHours(h, m, 0, 0)
    onChange(format(day, "yyyy-MM-dd'T'HH:mm:ss"))
    setOpen(false)
  }

  function handleTimeChange(type: 'hour' | 'minute', val: string) {
    const base = date ?? new Date()
    if (type === 'hour') base.setHours(parseInt(val))
    else base.setMinutes(parseInt(val))
    base.setSeconds(0)
    onChange(format(base, "yyyy-MM-dd'T'HH:mm:ss"))
  }

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn('flex-1 justify-start text-left font-normal', !date && 'text-muted-foreground')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'yyyy/MM/dd', { locale: ja }) : '日付を選択'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDaySelect}
            disabled={(d) => {
              const today = new Date(new Date().setHours(0, 0, 0, 0))
              if (d < today) return true
              if (minDate) {
                const minDay = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
                if (d < minDay) return true
              }
              return false
            }}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      <Select
        value={selectedHour}
        onValueChange={(v) => handleTimeChange('hour', v)}
        disabled={disabled || !date}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {HOURS.map((h) => (
            <SelectItem
              key={h}
              value={h}
              disabled={onMinDay && parseInt(h) < minHour}
            >
              {h}時
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedMinute}
        onValueChange={(v) => handleTimeChange('minute', v)}
        disabled={disabled || !date}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MINUTES.map((m) => (
            <SelectItem
              key={m}
              value={m}
              disabled={onMinDay && parseInt(selectedHour) === minHour && parseInt(m) < minMinute}
            >
              {m}分
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
