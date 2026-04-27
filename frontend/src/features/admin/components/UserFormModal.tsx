'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateUser } from '@/features/admin/hooks/useCreateUser'
import { useUpdateUser } from '@/features/admin/hooks/useUpdateUser'
import type { UserOut } from '@/types'

const createSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z.string().min(4, '4文字以上のパスワードを入力してください'),
  role: z.enum(['admin', 'user', 'manager']),
})
type CreateValues = z.infer<typeof createSchema>

const editSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  role: z.enum(['admin', 'user', 'manager']),
  is_active: z.boolean(),
  password: z.string().optional(),
})
type EditValues = z.infer<typeof editSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: UserOut
}

function CreateForm({ onClose }: { onClose: () => void }) {
  const { mutate, isPending } = useCreateUser()
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { role: 'user' },
  })

  return (
    <form onSubmit={handleSubmit((data) => mutate(data, { onSuccess: () => { reset(); onClose() } }))} className="space-y-4">
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
        <Select value={watch('role')} onValueChange={(v) => setValue('role', v as 'admin' | 'user' | 'manager')}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="user">一般社員</SelectItem>
            <SelectItem value="manager">清算担当</SelectItem>
            <SelectItem value="admin">管理者</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? '追加中...' : '追加する'}
      </Button>
    </form>
  )
}

function EditForm({ user, onClose }: { user: UserOut; onClose: () => void }) {
  const { mutate, isPending } = useUpdateUser()
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: user.name,
      role: user.role as 'admin' | 'user',
      is_active: user.is_active,
      password: '',
    },
  })

  const onSubmit = (data: EditValues) => {
    const payload: Parameters<typeof mutate>[0]['data'] = {
      name: data.name,
      role: data.role,
      is_active: data.is_active,
    }
    if (data.password && data.password.length >= 4) {
      payload.password = data.password
    }
    mutate({ id: user.id, data: payload }, { onSuccess: onClose })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="edit-name">名前</Label>
        <Input id="edit-name" {...register('name')} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-1">
        <Label>メールアドレス</Label>
        <p className="text-sm text-gray-500 py-2 px-3 border rounded-md bg-gray-50">{user.email}</p>
      </div>
      <div className="space-y-1">
        <Label htmlFor="edit-password">パスワード変更（空欄で変更なし）</Label>
        <Input id="edit-password" type="password" {...register('password')} placeholder="4文字以上" />
      </div>
      <div className="space-y-1">
        <Label>ロール</Label>
        <Select value={watch('role')} onValueChange={(v) => setValue('role', v as 'admin' | 'user' | 'manager')}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="user">一般社員</SelectItem>
            <SelectItem value="manager">清算担当</SelectItem>
            <SelectItem value="admin">管理者</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="is_active"
          checked={watch('is_active')}
          onCheckedChange={(checked) => setValue('is_active', !!checked)}
        />
        <Label htmlFor="is_active">有効</Label>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? '更新中...' : '更新する'}
      </Button>
    </form>
  )
}

export function UserFormModal({ open, onOpenChange, user }: Props) {
  const onClose = () => onOpenChange(false)
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? 'ユーザー編集' : 'ユーザー追加'}</DialogTitle>
        </DialogHeader>
        {user ? <EditForm user={user} onClose={onClose} /> : <CreateForm onClose={onClose} />}
      </DialogContent>
    </Dialog>
  )
}
