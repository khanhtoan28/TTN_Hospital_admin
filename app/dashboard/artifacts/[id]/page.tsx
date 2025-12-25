'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { artifactsService } from '@/lib/api/services'
import { ArtifactRequest } from '@/lib/api/types'
import { Save, X, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function EditArtifactPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const artifactId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<ArtifactRequest>({
    name: '',
    description: '',
    imageUrl: '',
    period: '',
    type: '',
    space: '',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (artifactId) {
      fetchArtifact()
    }
  }, [artifactId, isAuthenticated, router])

  const fetchArtifact = async () => {
    try {
      setLoading(true)
      setError('')
      const id = parseInt(artifactId)
      
      if (isNaN(id)) {
        setError('ID không hợp lệ')
        return
      }

      const response = await artifactsService.getById(id)
      if (response.success && response.data) {
        const data = response.data
        setFormData({
          name: data.artifactName,
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          period: data.period || '',
          type: data.type || '',
          space: data.space || '',
        })
      } else {
        setError(response.error || 'Không tìm thấy hiện vật')
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
      const id = parseInt(artifactId)
      const response = await artifactsService.update(id, formData)
      if (response.success) {
        router.push('/dashboard/artifacts')
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
      <AdminLayout title="Chỉnh sửa Hiện Vật">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-dark" />
        </div>
      </AdminLayout>
    )
  }

  if (error && !formData.name) {
    return (
      <AdminLayout title="Chỉnh sửa Hiện Vật">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
        <Link href="/dashboard/artifacts" className="btn-secondary">
          Quay lại danh sách
        </Link>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Chỉnh sửa Hiện Vật">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="label-field">
            Tên hiện vật *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            required
            maxLength={200}
            placeholder="Nhập tên hiện vật"
          />
        </div>

        <div>
          <label htmlFor="description" className="label-field">
            Mô tả
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field"
            rows={4}
            maxLength={1000}
            placeholder="Mô tả về hiện vật..."
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="period" className="label-field">
              Thời kỳ
            </label>
            <input
              id="period"
              type="text"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="input-field"
              maxLength={255}
              placeholder="Ví dụ: 1951-1965"
            />
          </div>

          <div>
            <label htmlFor="type" className="label-field">
              Loại
            </label>
            <input
              id="type"
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input-field"
              maxLength={255}
              placeholder="Ví dụ: Thiết bị, Giấy tờ..."
            />
          </div>

          <div>
            <label htmlFor="space" className="label-field">
              Không gian
            </label>
            <input
              id="space"
              type="text"
              value={formData.space}
              onChange={(e) => setFormData({ ...formData, space: e.target.value })}
              className="input-field"
              maxLength={255}
              placeholder="Ví dụ: Khu A, Khu B..."
            />
          </div>
        </div>

        <div>
          <label htmlFor="imageUrl" className="label-field">
            URL hình ảnh
          </label>
          <input
            id="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="input-field"
            maxLength={500}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="flex space-x-4">
          <button type="submit" disabled={saving} className="btn-primary flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
          </button>
          <Link href="/dashboard/artifacts" className="btn-secondary flex items-center space-x-2">
            <X className="w-5 h-5" />
            <span>Hủy</span>
          </Link>
        </div>
      </form>
    </AdminLayout>
  )
}



