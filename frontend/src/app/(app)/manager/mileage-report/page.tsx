'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiClient } from '@/lib/api'
import { Plus, Trash2, Download, Save, Check } from 'lucide-react'

interface ReportRow {
  user_id: number
  name: string
  email: string
  total_km: number
  allowance: number
}

interface ReportResponse {
  year: number
  month: number
  report: ReportRow[]
}

interface Threshold {
  km: string
  amount: string
}

interface ThresholdOut {
  id: number
  km: number
  amount: number
}

function buildThresholdParam(thresholds: Threshold[]): string {
  return thresholds
    .filter((t) => t.km && t.amount)
    .map((t) => `${t.km}:${t.amount}`)
    .join(',')
}

export default function MileageReportPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [thresholds, setThresholds] = useState<Threshold[]>([{ km: '', amount: '' }])
  const [report, setReport] = useState<ReportResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    apiClient.get<ThresholdOut[]>('/mileage-report/thresholds').then((data) => {
      if (data.length > 0) {
        setThresholds(data.map((t) => ({ km: String(t.km), amount: String(t.amount) })))
      }
    }).catch(() => {})
  }, [])

  const addThreshold = () => {
    setThresholds((prev) => [...prev, { km: '', amount: '' }])
    setSaved(false)
  }
  const removeThreshold = (i: number) => {
    setThresholds((prev) => prev.filter((_, idx) => idx !== i))
    setSaved(false)
  }
  const updateThreshold = (i: number, key: 'km' | 'amount', value: string) => {
    setThresholds((prev) => prev.map((t, idx) => (idx === i ? { ...t, [key]: value } : t)))
    setSaved(false)
  }

  const saveThresholds = async () => {
    setSaving(true)
    try {
      const valid = thresholds
        .filter((t) => t.km && t.amount)
        .map((t) => ({ km: parseFloat(t.km), amount: parseFloat(t.amount) }))
      await apiClient.put('/mileage-report/thresholds', valid)
      setSaved(true)
    } catch {
      setError('しきい値の保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const fetchReport = async () => {
    setLoading(true)
    setError(null)
    try {
      const tp = buildThresholdParam(thresholds)
      const url = `/mileage-report/monthly?year=${year}&month=${month}${tp ? `&thresholds=${tp}` : ''}`
      const data = await apiClient.get<ReportResponse>(url)
      setReport(data)
    } catch {
      setError('データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const downloadCsv = () => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'
    const tp = buildThresholdParam(thresholds)
    const url = `${base}/mileage-report/monthly/csv?year=${year}&month=${month}${tp ? `&thresholds=${tp}` : ''}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">走行距離レポート</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">集計条件</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="space-y-1">
              <Label>年</Label>
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-24"
              />
            </div>
            <div className="space-y-1">
              <Label>月</Label>
              <Input
                type="number"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label>手当しきい値</Label>
                <p className="text-xs text-gray-500 mt-0.5">
                  走行距離が指定km以上の場合に金額を手当として付与。複数設定可能（最大条件を適用）
                </p>
              </div>
              <Button
                size="sm"
                variant={saved ? 'outline' : 'default'}
                onClick={saveThresholds}
                disabled={saving}
                className={saved ? 'text-green-600 border-green-300' : ''}
              >
                {saved ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1" />
                    保存済み
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 mr-1" />
                    {saving ? '保存中...' : '保存する'}
                  </>
                )}
              </Button>
            </div>
            {thresholds.map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="距離 (km)"
                  value={t.km}
                  onChange={(e) => updateThreshold(i, 'km', e.target.value)}
                  className="w-32"
                />
                <span className="text-sm text-gray-500">km 以上 →</span>
                <Input
                  type="number"
                  placeholder="手当 (円)"
                  value={t.amount}
                  onChange={(e) => updateThreshold(i, 'amount', e.target.value)}
                  className="w-32"
                />
                <span className="text-sm text-gray-500">円</span>
                {thresholds.length > 1 && (
                  <button onClick={() => removeThreshold(i)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={addThreshold}>
              <Plus className="h-4 w-4 mr-1" />
              しきい値を追加
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={fetchReport} disabled={loading}>
              {loading ? '集計中...' : '集計する'}
            </Button>
            {report && (
              <Button variant="outline" onClick={downloadCsv}>
                <Download className="h-4 w-4 mr-1" />
                CSV出力
              </Button>
            )}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
      </Card>

      {report && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {report.year}年{report.month}月 集計結果
            </CardTitle>
          </CardHeader>
          <CardContent>
            {report.report.length === 0 ? (
              <p className="text-sm text-gray-500">この月の走行記録はありません</p>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left px-4 py-3">名前</th>
                      <th className="text-left px-4 py-3">メール</th>
                      <th className="text-right px-4 py-3">走行距離</th>
                      <th className="text-right px-4 py-3">手当</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {report.report.map((row) => (
                      <tr key={row.user_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{row.name}</td>
                        <td className="px-4 py-3 text-gray-500">{row.email}</td>
                        <td className="px-4 py-3 text-right">{row.total_km.toFixed(1)} km</td>
                        <td className="px-4 py-3 text-right font-medium">
                          {row.allowance > 0 ? `¥${row.allowance.toLocaleString()}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
