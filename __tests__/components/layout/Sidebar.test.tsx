import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from '@/components/layout/Sidebar'
import { useAuthStore } from '@/features/auth/store'
import { useUIStore } from '@/features/ui/store'

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/dashboard'),
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

describe('Sidebar', () => {
  beforeEach(() => {
    useUIStore.setState({ collapsed: false })
  })

  it('userロールで user ナビ項目が表示される', () => {
    useAuthStore.setState({ token: 'tok', email: 'user@example.com', role: 'user' })
    render(<Sidebar />)
    expect(screen.getByText('配車予約申請')).toBeInTheDocument()
    expect(screen.getByText('自分の予約一覧')).toBeInTheDocument()
    expect(screen.queryByText('承認')).not.toBeInTheDocument()
    expect(screen.queryByText('予約管理')).not.toBeInTheDocument()
  })

  it('adminロールで admin ナビ項目が表示される', () => {
    useAuthStore.setState({ token: 'tok', email: 'admin@example.com', role: 'admin' })
    render(<Sidebar />)
    expect(screen.getByText('承認')).toBeInTheDocument()
    expect(screen.getByText('予約管理')).toBeInTheDocument()
    expect(screen.queryByText('自分の予約一覧')).not.toBeInTheDocument()
    expect(screen.queryByText('配車予約申請')).not.toBeInTheDocument()
  })

  it('トグルボタンクリックで collapsed が true になる', async () => {
    useAuthStore.setState({ token: 'tok', email: 'user@example.com', role: 'user' })
    render(<Sidebar />)
    const button = screen.getByRole('button', { name: 'サイドバーを折りたたむ' })
    await userEvent.click(button)
    expect(useUIStore.getState().collapsed).toBe(true)
  })
})
