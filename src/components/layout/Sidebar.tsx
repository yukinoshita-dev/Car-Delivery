'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarDays,
  Car,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Plus,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/features/auth/store'
import { useUIStore } from '@/features/ui/store'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const USER_NAV: NavItem[] = [
  { label: 'ダッシュボード', href: '/dashboard', icon: LayoutDashboard },
  { label: '配車予約申請', href: '/reservations/new', icon: Plus },
  { label: '自分の予約一覧', href: '/my-reservations', icon: CalendarDays },
  { label: '車両一覧', href: '/cars', icon: Car },
]

const ADMIN_NAV: NavItem[] = [
  { label: 'ダッシュボード', href: '/dashboard', icon: LayoutDashboard },
  { label: '承認', href: '/admin/approvals', icon: CheckCircle },
  { label: '予約管理', href: '/admin/reservations', icon: CalendarDays },
  { label: '車両管理', href: '/admin/cars', icon: Car },
  { label: 'ユーザー管理', href: '/admin/users', icon: Users },
]

export function Sidebar() {
  const { role } = useAuthStore()
  const { collapsed, toggleSidebar } = useUIStore()
  const pathname = usePathname()
  const navItems = role === 'admin' ? ADMIN_NAV : USER_NAV

  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        'relative flex flex-col h-screen bg-blue-900 text-white transition-all duration-200 shrink-0',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* ロゴ */}
      <div className="h-14 flex items-center justify-center border-b border-blue-800 px-4 shrink-0">
        {collapsed ? (
          <Car className="h-6 w-6" />
        ) : (
          <span className="text-lg font-bold tracking-wide">CarDelivery</span>
        )}
      </div>

      {/* ナビ */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-blue-700 text-white'
                : 'text-blue-100 hover:bg-blue-800 hover:text-white'
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* トグルボタン */}
      <div className="border-t border-blue-800 p-2 shrink-0">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center rounded-md p-2 hover:bg-blue-800 transition-colors"
          aria-label={collapsed ? 'サイドバーを展開' : 'サイドバーを折りたたむ'}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  )
}
