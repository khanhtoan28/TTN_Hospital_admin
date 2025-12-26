'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { userService } from '@/lib/api/services'
import { UserUpdateRequest } from '@/lib/api/types'
import { Save, X, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function EditUserPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<UserUpdateRequest>({
    fullname: '',
    email: '',
    phone: '',
    avatar: '',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (userId) {
      fetchUser()
    }
  }, [userId, isAuthenticated, router])

  const fetchUser = async () => {
    try {
      setLoading(true)
      setError('')
      const id = parseInt(userId)

      if (isNaN(id)) {
        setError('ID không hợp lệ')
        return
      }

      const response = await userService.getById(id)
      if (response.success && response.data) {
        const data = response.data
        setFormData({
          fullname: data.fullname || '',
          email: data.email || '',
          phone: data.phone || '',
          avatar: data.avatar || '',
        })
      } else {
        setError(response.error || 'Không tìm thấy người dùng')
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
      const id = parseInt(userId)
      // Chuẩn hóa dữ liệu - trim và chỉ gửi các field có giá trị non-empty
      // (Backend chỉ update field != null, và validation pattern yêu cầu format đúng)
      const updateData: UserUpdateRequest = {}
      if (formData.fullname && formData.fullname.trim()) {
        updateData.fullname = formData.fullname.trim()
      }
      if (formData.email && formData.email.trim()) {
        updateData.email = formData.email.trim()
      }
      if (formData.phone && formData.phone.trim()) {
        updateData.phone = formData.phone.trim()
      }
      if (formData.avatar && formData.avatar.trim()) {
        updateData.avatar = formData.avatar.trim()
      }
      
      const response = await userService.update(id, updateData)
      if (response.success) {
        router.push('/dashboard/users')
      } else {
        // Xử lý validation errors nếu có
        if (response.data && typeof response.data === 'object' && !('id' in response.data)) {
          // Nếu response.data không phải là User object (không có field 'id'), có thể là error object
          const errors = Object.values(response.data as unknown as Record<string, string>).join(', ')
          setError(errors || response.error || 'Cập nhật thất bại')
        } else {
          setError(response.error || response.message || 'Cập nhật thất bại')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Chỉnh sửa Người Dùng">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-dark" />
        </div>
      </AdminLayout>
    )
  }

  if (error && !formData.fullname) {
    return (
      <AdminLayout title="Chỉnh sửa Người Dùng">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
        <Link href="/dashboard/users" className="btn-secondary">
          Quay lại danh sách
        </Link>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Chỉnh sửa Người Dùng">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="fullname" className="label-field">
            Họ và tên
          </label>
          <input
            id="fullname"
            type="text"
            value={formData.fullname}
            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
            className="input-field"
            minLength={6}
            maxLength={100}
            placeholder="Nhập họ và tên (tối thiểu 6 ký tự)"
          />
          <p className="text-xs text-gray-500 mt-1">Nếu nhập, phải từ 6-100 ký tự</p>
        </div>

        <div>
          <label htmlFor="email" className="label-field">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-field"
            maxLength={255}
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="label-field">
            Số điện thoại
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input-field"
            maxLength={15}
            pattern="^\+?[0-9]{10,15}$"
            placeholder="0123456789"
          />
          <p className="text-xs text-gray-500 mt-1">Định dạng: 10-15 chữ số</p>
        </div>

        <div>
          <label htmlFor="avatar" className="label-field">
            URL Avatar
          </label>
          <input
            id="avatar"
            type="url"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            className="input-field"
            maxLength={255}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <div className="flex space-x-4">
          <button type="submit" disabled={saving} className="btn-primary flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
          </button>
          <Link href="/dashboard/users" className="btn-secondary flex items-center space-x-2">
            <X className="w-5 h-5" />
            <span>Hủy</span>
          </Link>
        </div>
      </form>
    </AdminLayout>
  )
}

