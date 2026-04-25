'use client'

import { Badge } from '@/components/ui/badge'
import { useUsers } from '@/features/admin/hooks/useUsers'

export default function AdminUsersPage() {
  const { data: users, isLoading } = useUsers()

  if (isLoading) return <p className="text-sm text-gray-400">読み込み中...</p>
  if (!users || users.length === 0) return <p className="text-sm text-gray-500">ユーザーが存在しません</p>

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">ユーザー一覧</h1>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">名前</th>
              <th className="text-left px-4 py-3">メール</th>
              <th className="text-left px-4 py-3">ロール</th>
              <th className="text-left px-4 py-3">状態</th>
              <th className="text-left px-4 py-3">登録日</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3">
                  {user.role === 'admin' ? (
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-0">管理者</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0">一般</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  {user.is_active ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0">有効</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">無効</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(user.created_at).toLocaleDateString('ja-JP')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
