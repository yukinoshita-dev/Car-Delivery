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
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = ['00', '30']

export function DateTimePicker({ value, onChange, disabled }: DateTimePickerProps) {
  const [open, setOpen] = useState(false)

  const date = value ? new Date(value) : undefined
  const selectedHour = date ? String(date.getHours()).padStart(2, '0') : '09'
  const selectedMinute = date ? (date.getMinutes() >= 30 ? '30' : '00') : '00'

  function handleDaySelect(day: Date | undefined) {
    if (!day) return
    const h = parseInt(selectedHour)
    const m = parseInt(selectedMinute)
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
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      <Select value={selectedHour} onValueChange={(v) => handleTimeChange('hour', v)} disabled={disabled || !date}>
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {HOURS.map((h) => (
            <SelectItem key={h} value={h}>{h}時</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedMinute} onValueChange={(v) => handleTimeChange('minute', v)} disabled={disabled || !date}>
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MINUTES.map((m) => (
            <SelectItem key={m} value={m}>{m}分</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
