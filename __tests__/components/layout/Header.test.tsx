import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/Header'

const mockPathname = vi.fn(() => '/dashboard')

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

vi.mock('@/components/layout/UserDropdown', () => ({
  UserDropdown: () => <div data-testid="user-dropdown" />,
}))

describe('Header', () => {
  it('/dashboard のとき「ダッシュボード」が表示される', () => {
    mockPathname.mockReturnValue('/dashboard')
    render(<Header />)
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
  })

  it('/admin/approvals のとき「承認」が表示される', () => {
    mockPathname.mockReturnValue('/admin/approvals')
    render(<Header />)
    expect(screen.getByText('承認')).toBeInTheDocument()
  })

  it('UserDropdown が表示される', () => {
    mockPathname.mockReturnValue('/dashboard')
    render(<Header />)
    expect(screen.getByTestId('user-dropdown')).toBeInTheDocument()
  })
})
