'use client'

import { usePathname } from 'next/navigation'
import { UserDropdown } from './UserDropdown'

const PATH_TITLE_MAP: Record<string, string> = {
  '/dashboard': 'ダッシュボード',
  '/reservations/new': '配車予約申請',
  '/my-reservations': '自分の予約一覧',
  '/cars': '車両一覧',
  '/admin/approvals': '承認',
  '/admin/reservations': '予約管理',
  '/admin/cars': '車両管理',
  '/admin/users': 'ユーザー管理',
}

export function Header() {
  const pathname = usePathname()
  const title = PATH_TITLE_MAP[pathname] ?? ''

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6 shrink-0">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <UserDropdown />
    </header>
  )
}
