'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { userService } from '@/lib/api/services'
import { User } from '@/lib/api/types'
import { ArrowLeft, Loader2, Edit } from 'lucide-react'
import Link from 'next/link'

export default function ViewUserPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Đợi auth context load xong
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (userId) {
      fetchUser()
    }
  }, [userId, isAuthenticated, authLoading, router])

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
        setUser(response.data)
      } else {
        setError(response.error || 'Không tìm thấy người dùng')
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <AdminLayout title="Chi tiết Người Dùng">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-dark" />
        </div>
      </AdminLayout>
    )
  }

  if (error && !user) {
    return (
      <AdminLayout title="Chi tiết Người Dùng">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
        <Link href="/dashboard/users" className="btn-secondary flex items-center space-x-2 w-fit">
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </Link>
      </AdminLayout>
    )
  }

  if (!user) {
    return (
      <AdminLayout title="Chi tiết Người Dùng">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
          Không tìm thấy thông tin người dùng
        </div>
        <Link href="/dashboard/users" className="btn-secondary flex items-center space-x-2 w-fit">
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </Link>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Chi tiết Người Dùng">
      <div className="max-w-4xl space-y-6">
        <div className="flex justify-between items-center">
          <Link href="/dashboard/users" className="btn-secondary flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </Link>
          <Link href={`/dashboard/users/${user.id}`} className="btn-primary flex items-center space-x-2">
            <Edit className="w-5 h-5" />
            <span>Chỉnh sửa</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-600">ID</label>
              <p className="mt-1 text-gray-900">{user.id}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Tên đăng nhập</label>
              <p className="mt-1 text-gray-900">{user.username}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Họ và tên</label>
              <p className="mt-1 text-gray-900">{user.fullname || '-'}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Email</label>
              <p className="mt-1 text-gray-900">{user.email || '-'}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Số điện thoại</label>
              <p className="mt-1 text-gray-900">{user.phone || '-'}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Trạng thái</label>
              <p className="mt-1">
                {user.isLocked ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Đã khóa
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Hoạt động
                  </span>
                )}
              </p>
            </div>

            {user.avatar && (
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-600">Avatar</label>
                <div className="mt-1">
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-600">Ngày tạo</label>
              <p className="mt-1 text-gray-900">
                {user.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : '-'}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Ngày cập nhật</label>
              <p className="mt-1 text-gray-900">
                {user.updatedAt ? new Date(user.updatedAt).toLocaleString('vi-VN') : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

