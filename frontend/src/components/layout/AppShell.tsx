import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main
          className="flex-1 overflow-y-auto bg-gray-50 p-6"
          style={{
            backgroundImage: `
              radial-gradient(circle, rgba(71,85,105,0.5) 1px, transparent 1px),
              linear-gradient(rgba(71,85,105,0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(71,85,105,0.12) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px, 96px 96px, 96px 96px',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
