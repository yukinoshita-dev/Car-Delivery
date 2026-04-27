'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

interface DayAvailability {
  date: string
  total_cars: number
  reserved_count: number
  available_count: number
}

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

function DayCard({ day }: { day: DayAvailability }) {
  const date = new Date(day.date + 'T00:00:00')
  const dayOfWeek = date.getDay()
  const isFull = day.total_cars > 0 && day.reserved_count >= day.total_cars
  const isEmpty = day.total_cars === 0
  const ratio = day.total_cars > 0 ? day.reserved_count / day.total_cars : 0
  const isToday = day.date === new Date().toISOString().slice(0, 10)

  const pct = Math.round(ratio * 100)

  // 色設定
  const isSat = dayOfWeek === 6
  const isSun = dayOfWeek === 0
  const dayTextColor = isSat ? 'text-blue-500' : isSun ? 'text-red-500' : 'text-gray-600'

  // カードのボーダー・背景
  const cardBg = isFull
    ? 'bg-red-50 border-red-300'
    : isToday
    ? 'bg-blue-50 border-blue-300'
    : 'bg-white border-gray-200'

  // ゲージの色
  const gaugeColor = isFull
    ? '#ef4444'
    : ratio >= 0.7
    ? '#f97316'
    : ratio >= 0.4
    ? '#eab308'
    : '#22c55e'

  // SVG ドーナツグラフ用
  const r = 28
  const circumference = 2 * Math.PI * r
  const dashOffset = circumference * (1 - ratio)

  return (
    <div
      className={`
        relative flex flex-col items-center rounded-2xl border-2 p-3 gap-2
        transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
        ${cardBg}
      `}
    >
      {/* 今日バッジ */}
      {isToday && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          今日
        </span>
      )}

      {/* 曜日 */}
      <p className={`text-xs font-bold ${dayTextColor}`}>
        {DAY_LABELS[dayOfWeek]}
      </p>

      {/* 日付 */}
      <p className="text-lg font-black text-gray-800 leading-none">
        {date.getMonth() + 1}/{date.getDate()}
      </p>

      {/* ドーナツグラフ */}
      <div className="relative flex items-center justify-center">
        <svg width="72" height="72" className="-rotate-90">
          {/* 背景リング */}
          <circle
            cx="36" cy="36" r={r}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="7"
          />
          {/* 進捗リング */}
          {!isEmpty && (
            <circle
              cx="36" cy="36" r={r}
              fill="none"
              stroke={gaugeColor}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          )}
        </svg>
        {/* 中央テキスト */}
        <div className="absolute flex flex-col items-center">
          <span className="text-xs font-bold text-gray-800 leading-none">
            {day.reserved_count}
          </span>
          <span className="text-[9px] text-gray-400 leading-none">/{day.total_cars}</span>
        </div>
      </div>

      {/* ステータスラベル */}
      {isFull ? (
        <span className="text-[11px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
          満車
        </span>
      ) : isEmpty ? (
        <span className="text-[11px] text-gray-400">車両なし</span>
      ) : (
        <span className="text-[11px] font-semibold text-gray-600">
          空き <span className="text-green-600 font-black">{day.available_count}</span> 台
        </span>
      )}

      {/* パーセントバー */}
      {!isEmpty && (
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: gaugeColor }}
          />
        </div>
      )}
    </div>
  )
}

export function AvailabilityChecker() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['weekly-availability'],
    queryFn: () => apiClient.get<DayAvailability[]>('/dashboard/weekly-availability'),
    refetchInterval: 60_000,
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">今週の予約状況</h2>
        <span className="text-xs text-gray-400">1分ごとに自動更新</span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-red-500">データの取得に失敗しました</p>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {data?.map((day) => (
            <DayCard key={day.date} day={day} />
          ))}
        </div>
      )}
    </div>
  )
}
