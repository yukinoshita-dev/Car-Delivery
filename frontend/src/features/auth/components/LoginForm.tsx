'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLogin } from '@/features/auth/hooks/useLogin'
import type { Role } from '@/types'

const schema = z.object({
  email: z.string().min(1, 'メールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
})
type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const [role, setRole] = useState<Role>('user')
  const { mutate, isPending, isError, error } = useLogin()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  function onSubmit(data: FormValues) {
    mutate({ ...data, role })
  }

  function fillDemo(demoRole: Role) {
    const email =
      demoRole === 'admin' ? 'admin@demo.com' :
      demoRole === 'manager' ? 'manager@demo.com' :
      'user@demo.com'
    setValue('email', email)
    setValue('password', 'demo')
    setRole(demoRole)
  }

  return (
    <div className="w-full max-w-md space-y-4">
      {/* デモ告知バナー */}
      <div className="rounded-md bg-yellow-50 border border-yellow-300 px-4 py-3 text-sm text-yellow-800">
        これはポートフォリオ用のデモシステムです。下のボタンでデモアカウントを自動入力できます。
      </div>

      {/* デモアカウント自動入力 */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
          onClick={() => fillDemo('user')}
        >
          一般社員でデモ
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 text-xs border-green-200 text-green-700 hover:bg-green-50"
          onClick={() => fillDemo('manager')}
        >
          清算管理でデモ
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
          onClick={() => fillDemo('admin')}
        >
          管理者でデモ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl">営業車両配車システム</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ロール選択（表示のみ・実際のロールはDBから取得） */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={role === 'user' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setRole('user')}
              >
                一般社員
              </Button>
              <Button
                type="button"
                variant={role === 'manager' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setRole('manager')}
              >
                清算担当
              </Button>
              <Button
                type="button"
                variant={role === 'admin' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setRole('admin')}
              >
                管理者
              </Button>
            </div>

            {/* メールアドレス */}
            <div className="space-y-1">
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" type="email" placeholder="any@example.com" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* パスワード */}
            <div className="space-y-1">
              <Label htmlFor="password">パスワード</Label>
              <Input id="password" type="password" placeholder="なんでもOK" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {isError && (
              <p className="text-sm text-red-500">
                {error instanceof Error ? error.message : 'ログインに失敗しました'}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'ログイン中...' : 'ログイン'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
