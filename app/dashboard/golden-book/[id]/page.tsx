'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { goldenBookService } from '@/lib/api/services'
import { GoldenBookRequest } from '@/lib/api/types'
import { Save, X, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function EditGoldenBookPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const bookId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<GoldenBookRequest>({
    goldenBookName: '',
    level: '',
    year: new Date().getFullYear(),
    department: '',
    image: '',
    description: '',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (bookId) {
      fetchBook()
    }
  }, [bookId, isAuthenticated, router])

  const fetchBook = async () => {
    try {
      setLoading(true)
      setError('')
      const id = parseInt(bookId)
      
      if (isNaN(id)) {
        setError('ID không hợp lệ')
        return
      }

      const response = await goldenBookService.getById(id)
      if (response.success && response.data) {
        const data = response.data
        setFormData({
          goldenBookName: data.goldenBookName,
          level: data.level,
          year: data.year,
          department: data.department,
          image: data.image || '',
          description: data.description || '',
        })
      } else {
        setError(response.error || 'Không tìm thấy sổ vàng')
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
      const id = parseInt(bookId)
      const response = await goldenBookService.update(id, formData)
      if (response.success) {
        router.push('/dashboard/golden-book')
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
      <AdminLayout title="Chỉnh sửa Sổ Vàng">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-dark" />
        </div>
      </AdminLayout>
    )
  }

  if (error && !formData.goldenBookName) {
    return (
      <AdminLayout title="Chỉnh sửa Sổ Vàng">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
        <Link href="/dashboard/golden-book" className="btn-secondary">
          Quay lại danh sách
        </Link>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Chỉnh sửa Sổ Vàng">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="goldenBookName" className="label-field">
            Tên sổ vàng *
          </label>
          <input
            id="goldenBookName"
            type="text"
            value={formData.goldenBookName}
            onChange={(e) => setFormData({ ...formData, goldenBookName: e.target.value })}
            className="input-field"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="level" className="label-field">
            Cấp khen *
          </label>
          <input
            id="level"
            type="text"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="input-field"
            required
            maxLength={100}
            placeholder="Ví dụ: Bộ Y tế, Bộ Công An..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className="label-field">
              Năm *
            </label>
            <input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2024 })}
              className="input-field"
              required
              min={1900}
              max={2100}
            />
          </div>

          <div>
            <label htmlFor="department" className="label-field">
              Khoa/phòng ban *
            </label>
            <input
              id="department"
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="input-field"
              required
              maxLength={100}
            />
          </div>
        </div>

        <div>
          <label htmlFor="image" className="label-field">
            URL hình ảnh
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
            maxLength={500}
            placeholder="Mô tả về bằng khen..."
          />
        </div>

        <div className="flex space-x-4">
          <button type="submit" disabled={saving} className="btn-primary flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
          </button>
          <Link href="/dashboard/golden-book" className="btn-secondary flex items-center space-x-2">
            <X className="w-5 h-5" />
            <span>Hủy</span>
          </Link>
        </div>
      </form>
    </AdminLayout>
  )
}



