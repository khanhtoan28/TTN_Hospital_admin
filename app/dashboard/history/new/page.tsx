'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { historyService } from '@/lib/api/services'
import { HistoryRequest } from '@/lib/api/types'
import { Save, X } from 'lucide-react'
import Link from 'next/link'

export default function NewHistoryPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<HistoryRequest>({
    year: '',
    title: '',
    period: '',
    description: '',
    icon: '',
    image: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await historyService.create(formData)
      if (response.success) {
        router.push('/dashboard/history')
      } else {
        setError(response.error || 'Tạo mới thất bại')
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Thêm mới Mốc Lịch Sử">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className="label-field">
              Năm *
            </label>
            <input
              id="year"
              type="text"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="input-field"
              required
              maxLength={255}
              placeholder="Ví dụ: 1951 hoặc 1951-1965"
            />
          </div>

          <div>
            <label htmlFor="period" className="label-field">
              Giai đoạn *
            </label>
            <input
              id="period"
              type="text"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="input-field"
              required
              maxLength={255}
              placeholder="Ví dụ: Kháng chiến chống Pháp"
            />
          </div>
        </div>

        <div>
          <label htmlFor="title" className="label-field">
            Tiêu đề *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-field"
            required
            maxLength={255}
            placeholder="Nhập tiêu đề mốc lịch sử"
          />
        </div>

        <div>
          <label htmlFor="description" className="label-field">
            Mô tả *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field"
            rows={6}
            required
            maxLength={1000}
            placeholder="Mô tả chi tiết về mốc lịch sử..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="icon" className="label-field">
              URL Icon
            </label>
            <input
              id="icon"
              type="url"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="input-field"
              maxLength={255}
              placeholder="https://example.com/icon.svg"
            />
          </div>

          <div>
            <label htmlFor="image" className="label-field">
              URL Hình ảnh
            </label>
            <input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="input-field"
              maxLength={255}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>{loading ? 'Đang lưu...' : 'Lưu'}</span>
          </button>
          <Link href="/dashboard/history" className="btn-secondary flex items-center space-x-2">
            <X className="w-5 h-5" />
            <span>Hủy</span>
          </Link>
        </div>
      </form>
    </AdminLayout>
  )
}

