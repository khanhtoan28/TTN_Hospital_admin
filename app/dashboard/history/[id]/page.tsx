'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { historyService } from '@/lib/api/services'
import { HistoryRequest } from '@/lib/api/types'
import { Save, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import ImagePicker from '@/components/common/ImagePicker'

export default function EditHistoryPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const historyId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<HistoryRequest>({
    year: '',
    title: '',
    period: '',
    description: '',
    icon: '',
    iconImageId: undefined,
    image: '',
    imageId: undefined,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (historyId) {
      fetchHistory()
    }
  }, [historyId, isAuthenticated, router])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      setError('')
      const id = parseInt(historyId)
      
      if (isNaN(id)) {
        setError('ID không hợp lệ')
        return
      }

      const response = await historyService.getById(id)
      if (response.success && response.data) {
        const data = response.data
        setFormData({
          year: data.year,
          title: data.title,
          period: data.period,
          description: data.description,
          icon: data.icon || '',
          image: data.image || '',
        })
      } else {
        setError(response.error || 'Không tìm thấy mốc lịch sử')
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const id = parseInt(historyId)
      const response = await historyService.update(id, formData)
      if (response.success) {
        router.push('/dashboard/history')
      } else {
        setError(response.error || 'Cập nhật thất bại')
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Chỉnh sửa Mốc Lịch Sử">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-dark" />
        </div>
      </AdminLayout>
    )
  }

  if (error && !formData.title) {
    return (
      <AdminLayout title="Chỉnh sửa Mốc Lịch Sử">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
        <Link href="/dashboard/history" className="btn-secondary">
          Quay lại danh sách
        </Link>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Chỉnh sửa Mốc Lịch Sử">
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
          <ImagePicker
            value={formData.iconImageId}
            imageUrl={formData.icon}
            onSelect={(imageId, imageUrl) => {
              setFormData({
                ...formData,
                iconImageId: imageId || undefined,
                icon: imageUrl || undefined,
              })
            }}
            label="Icon"
            placeholder="Chọn icon hoặc nhập URL"
          />

          <ImagePicker
            value={formData.imageId}
            imageUrl={formData.image}
            onSelect={(imageId, imageUrl) => {
              setFormData({
                ...formData,
                imageId: imageId || undefined,
                image: imageUrl || undefined,
              })
            }}
            label="Hình ảnh"
            placeholder="Chọn hình ảnh hoặc nhập URL"
          />
        </div>

        <div className="flex space-x-4">
          <button type="submit" disabled={saving} className="btn-primary flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
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

