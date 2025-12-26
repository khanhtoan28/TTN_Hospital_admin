'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { userService } from '@/lib/api/services'
import { User } from '@/lib/api/types'
import { Edit, Trash2, Loader2, Lock, Unlock, Plus } from 'lucide-react'
import Link from 'next/link'

export default function UsersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [lockingId, setLockingId] = useState<number | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers()
    }
  }, [isAuthenticated])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await userService.getAll()
      if (response.success && response.data) {
        setUsers(response.data)
      } else {
        setError(response.error || 'Không thể tải dữ liệu')
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return
    }

    try {
      setDeletingId(id)
      const response = await userService.delete(id)
      if (response.success) {
        setUsers(users.filter((user) => user.id !== id))
      } else {
        alert(response.error || 'Xóa thất bại')
      }
    } catch (err: any) {
      alert(err.message || 'Đã xảy ra lỗi khi xóa')
    } finally {
      setDeletingId(null)
    }
  }

  const handleLock = async (id: number) => {
    try {
      setLockingId(id)
      const response = await userService.lock(id)
      if (response.success && response.data) {
        setUsers(users.map((user) => (user.id === id ? response.data! : user)))
      } else {
        alert(response.error || 'Khóa tài khoản thất bại')
      }
    } catch (err: any) {
      alert(err.message || 'Đã xảy ra lỗi khi khóa tài khoản')
    } finally {
      setLockingId(null)
    }
  }

  const handleUnlock = async (id: number) => {
    try {
      setLockingId(id)
      const response = await userService.unlock(id)
      if (response.success && response.data) {
        setUsers(users.map((user) => (user.id === id ? response.data! : user)))
      } else {
        alert(response.error || 'Mở khóa tài khoản thất bại')
      }
    } catch (err: any) {
      alert(err.message || 'Đã xảy ra lỗi khi mở khóa tài khoản')
    } finally {
      setLockingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  if (authLoading || loading) {
    return (
      <AdminLayout title="Người Dùng">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-dark" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Quản lý Người Dùng">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Tổng số: {users.length} người dùng</p>
        <Link
          href="/dashboard/users/new"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm mới</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">Chưa có dữ liệu người dùng</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-primary-dark text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tên đăng nhập</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Họ và tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.fullname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isLocked ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Đã khóa
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Hoạt động
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className="text-primary-dark hover:text-primary-dark/80 inline-flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Link>
                    {user.isLocked ? (
                      <button
                        onClick={() => handleUnlock(user.id)}
                        disabled={lockingId === user.id}
                        className="text-green-600 hover:text-green-800 inline-flex items-center disabled:opacity-50"
                      >
                        {lockingId === user.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Unlock className="w-4 h-4 mr-1" />
                        )}
                        Mở khóa
                      </button>
                    ) : (
                      <button
                        onClick={() => handleLock(user.id)}
                        disabled={lockingId === user.id}
                        className="text-orange-600 hover:text-orange-800 inline-flex items-center disabled:opacity-50"
                      >
                        {lockingId === user.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Lock className="w-4 h-4 mr-1" />
                        )}
                        Khóa
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
                      className="text-red-600 hover:text-red-800 inline-flex items-center disabled:opacity-50"
                    >
                      {deletingId === user.id ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-1" />
                      )}
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}

