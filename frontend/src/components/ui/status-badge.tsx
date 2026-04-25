import { Badge } from '@/components/ui/badge'
import type { ReservationStatus } from '@/types'

const STATUS_CONFIG: Record<ReservationStatus, { label: string; className: string }> = {
  pending:     { label: '承認待ち', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-0' },
  approved:    { label: '承認済み', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-0' },
  in_progress: { label: '使用中',   className: 'bg-green-100 text-green-800 hover:bg-green-100 border-0' },
  completed:   { label: '完了',     className: 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-0' },
  cancelled:   { label: '却下',     className: 'bg-red-100 text-red-700 hover:bg-red-100 border-0' },
}

export function StatusBadge({ status }: { status: ReservationStatus }) {
  const { label, className } = STATUS_CONFIG[status]
  return <Badge className={className}>{label}</Badge>
}
