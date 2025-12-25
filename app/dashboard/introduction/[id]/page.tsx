'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { introductionService } from '@/lib/api/services'
import { IntroductionRequest } from '@/lib/api/types'
import { Save, X, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function EditIntroductionPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const introductionId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<IntroductionRequest>({
    section: '',
    content: '',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (introductionId) {
      fetchIntroduction()
    }
  }, [introductionId, isAuthenticated, router])

  const fetchIntroduction = async () => {
    try {
      setLoading(true)
      setError('')
      const id = parseInt(introductionId)
      
      if (isNaN(id)) {
        setError('ID không hợp lệ')
        return
      }

      const response = await introductionService.getById(id)
      if (response.success && response.data) {
        const data = response.data
        setFormData({
          section: data.section,
          content: data.content,
        })
      } else {
        setError(response.error || 'Không tìm thấy phần giới thiệu')
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
      const id = parseInt(introductionId)
      const response = await introductionService.update(id, formData)
      if (response.success) {
        router.push('/dashboard/introduction')
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
      <AdminLayout title="Chỉnh sửa Giới Thiệu">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-dark" />
        </div>
      </AdminLayout>
    )
  }

  if (error && !formData.section) {
    return (
      <AdminLayout title="Chỉnh sửa Giới Thiệu">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
        <Link href="/dashboard/introduction" className="btn-secondary">
          Quay lại danh sách
        </Link>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Chỉnh sửa Giới Thiệu">
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="section" className="label-field">
            Phần *
          </label>
          <input
            id="section"
            type="text"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            className="input-field"
            required
            maxLength={100}
            placeholder="Ví dụ: Giới thiệu chung, Lịch sử hình thành, Sứ mệnh..."
          />
        </div>

        <div>
          <label htmlFor="content" className="label-field">
            Nội dung *
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="input-field"
            rows={15}
            required
            maxLength={10000}
            placeholder="Nhập nội dung giới thiệu..."
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.content.length}/10000 ký tự
          </p>
        </div>

        <div className="flex space-x-4">
          <button type="submit" disabled={saving} className="btn-primary flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
          </button>
          <Link href="/dashboard/introduction" className="btn-secondary flex items-center space-x-2">
            <X className="w-5 h-5" />
            <span>Hủy</span>
          </Link>
        </div>
      </form>
    </AdminLayout>
  )
}

