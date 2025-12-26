'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { userService } from '@/lib/api/services'
import { UserCreateRequest } from '@/lib/api/types'
import { Save, X } from 'lucide-react'
import Link from 'next/link'

export default function NewUserPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<UserCreateRequest>({
    username: '',
    password: '',
    email: '',
    phone: '',
    fullname: '',
    avatar: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Chuẩn hóa dữ liệu - trim và xử lý empty strings
      const createData: UserCreateRequest = {
        username: formData.username.trim(),
        password: formData.password,
        email: formData.email.trim(),
        fullname: formData.fullname.trim(),
        phone: formData.phone?.trim() || undefined,
        avatar: formData.avatar?.trim() || undefined,
      }

      const response = await userService.create(createData)
      if (response.success) {
        router.push('/dashboard/users')
      } else {
        // Xử lý validation errors nếu có
        if (response.data && typeof response.data === 'object') {
          const errors = Object.values(response.data as Record<string, string>).join(', ')
          setError(errors || response.error || 'Tạo mới thất bại')
        } else {
          setError(response.error || response.message || 'Tạo mới thất bại')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Thêm mới Người Dùng">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="username" className="label-field">
            Tên đăng nhập *
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="input-field"
            required
            minLength={6}
            maxLength={100}
            pattern="^[a-zA-Z0-9]+$"
            placeholder="Chỉ chứa chữ cái và số, tối thiểu 6 ký tự"
          />
          <p className="text-xs text-gray-500 mt-1">Tên đăng nhập chỉ được chứa chữ cái và số</p>
        </div>

        <div>
          <label htmlFor="password" className="label-field">
            Mật khẩu *
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="input-field"
            required
            minLength={6}
            maxLength={100}
            placeholder="Tối thiểu 6 ký tự"
          />
        </div>

        <div>
          <label htmlFor="fullname" className="label-field">
            Họ và tên *
          </label>
          <input
            id="fullname"
            type="text"
            value={formData.fullname}
            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
            className="input-field"
            required
            minLength={6}
            maxLength={100}
            placeholder="Nhập họ và tên đầy đủ"
          />
        </div>

        <div>
          <label htmlFor="email" className="label-field">
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-field"
            required
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
          <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>{loading ? 'Đang lưu...' : 'Lưu'}</span>
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

