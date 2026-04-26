'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateUser } from '@/features/admin/hooks/useCreateUser'

const schema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z.string().min(4, '4文字以上のパスワードを入力してください'),
  role: z.enum(['admin', 'user']),
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserFormModal({ open, onOpenChange }: Props) {
  const { mutate, isPending } = useCreateUser()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'user' },
  })

  const onClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ユーザー追加</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) => mutate(data, { onSuccess: onClose }))}
          className="space-y-4"
        >
          <div className="space-y-1">
            <Label htmlFor="name">名前</Label>
            <Input id="name" {...register('name')} placeholder="例: 山田 太郎" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" type="email" {...register('email')} placeholder="例: yamada@example.com" />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">パスワード</Label>
            <Input id="password" type="password" {...register('password')} placeholder="4文字以上" />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <div className="space-y-1">
            <Label>ロール</Label>
            <Select value={watch('role')} onValueChange={(v) => setValue('role', v as 'admin' | 'user')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">一般社員</SelectItem>
                <SelectItem value="admin">管理者</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? '追加中...' : '追加する'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
