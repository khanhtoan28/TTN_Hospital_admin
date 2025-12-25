'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { introductionService } from '@/lib/api/services'
import { IntroductionRequest } from '@/lib/api/types'
import { Save, X } from 'lucide-react'
import Link from 'next/link'

export default function NewIntroductionPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<IntroductionRequest>({
    section: '',
    content: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await introductionService.create(formData)
      if (response.success) {
        router.push('/dashboard/introduction')
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
    <AdminLayout title="Thêm mới Giới Thiệu">
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
          <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>{loading ? 'Đang lưu...' : 'Lưu'}</span>
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

