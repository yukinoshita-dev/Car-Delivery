# アプリシェル（レイアウト）設計ドキュメント (Plan 3)

## 概要

認証済みページ全体を包むアプリシェルを実装する。折りたたみ式サイドバー・ヘッダー・ユーザードロップダウンで構成。

---

## ファイル構成

```
frontend/src/
├── features/ui/
│   └── store.ts                  New: useUIStore（collapsed状態）
├── components/layout/
│   ├── AppShell.tsx              New: Sidebar + Header + main の外枠
│   ├── Sidebar.tsx               New: 折りたたみサイドバー（role別ナビ）
│   ├── Header.tsx                New: ページタイトル + UserDropdown
│   └── UserDropdown.tsx          New: アバター → ドロップダウン（ログアウト）
└── app/(app)/
    └── layout.tsx                Modify: AppShell を組み込む
```

---

## 状態管理

**useUIStore（新規）**
- `collapsed: boolean` — サイドバーの折りたたみ状態
- `toggleSidebar()` — トグル
- localStorage永続化なし

**ページタイトル**
- `usePathname()` + 静的マッピング（PATH_TITLE_MAP）で Header 内解決
- 各ページからの state 書き込み不要

---

## コンポーネント設計

### Sidebar
- 幅: 展開 `w-56` / 折りたたみ `w-16`、`transition-all duration-200`
- 背景: `bg-blue-900`、テキスト: `text-white`
- アクティブ項目: `bg-blue-700`
- role別ナビ（USER_NAV / ADMIN_NAV）
- 下部にトグルボタン（ChevronLeft / ChevronRight）

### ナビ項目

| role | 項目 |
|------|------|
| user | ダッシュボード・配車予約申請・自分の予約一覧・車両一覧 |
| admin | ダッシュボード・承認・予約管理・車両管理・ユーザー管理 |

### Header
- 高さ `h-14`、白背景、下ボーダー
- 左: pathname マッピングで取得したページタイトル
- 右: UserDropdown

### UserDropdown
- トリガー: アバター（メールイニシャル）＋ 表示名 ＋ ロールバッジ
- ドロップダウン: メールアドレス表示 ＋ ログアウトボタン
- ログアウト: `useAuthStore.logout()` → `/login` リダイレクト

---

## PATH_TITLE_MAP

| パス | タイトル |
|------|---------|
| /dashboard | ダッシュボード |
| /reservations/new | 配車予約申請 |
| /my-reservations | 自分の予約一覧 |
| /cars | 車両一覧 |
| /admin/approvals | 承認 |
| /admin/reservations | 予約管理 |
| /admin/cars | 車両管理 |
| /admin/users | ユーザー管理 |

---

## テスト方針

- `Sidebar.test.tsx`: role別ナビ表示・トグル動作
- `Header.test.tsx`: pathname→タイトル変換・UserDropdown表示
- `useUIStore` は単純すぎるためテストなし（toggle の副作用なし）
