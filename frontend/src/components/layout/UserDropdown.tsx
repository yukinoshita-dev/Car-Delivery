'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/features/auth/store'

export function UserDropdown() {
  const { email, role, logout } = useAuthStore()
  const router = useRouter()
  const initial = email ? email[0].toUpperCase() : '?'
  const displayName = email ? email.split('@')[0] : ''

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium shrink-0">
            {initial}
          </div>
          <span className="text-sm font-medium hidden sm:block">{displayName}</span>
          <Badge
            variant={role === 'admin' ? 'default' : 'secondary'}
            className="hidden sm:block text-xs"
          >
            {role === 'admin' ? '管理者' : '一般社員'}
          </Badge>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm text-gray-500 truncate">{email}</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 cursor-pointer focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
