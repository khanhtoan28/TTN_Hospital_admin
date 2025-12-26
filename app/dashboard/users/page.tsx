'use client'

import { useState, useCallback } from 'react'
import AdminLayout from '@/components/AdminLayout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import { useListPage } from '@/hooks/useListPage'
import { userService } from '@/lib/api/services'
import { User } from '@/lib/api/types'
import { Edit, Trash2, Loader2, Lock, Unlock, Plus } from 'lucide-react'
import Link from 'next/link'

export default function UsersPage() {
  const fetchFn = useCallback(() => userService.getAll(), [])
  const deleteFn = useCallback((id: number) => userService.delete(id), [])
  const getId = useCallback((user: User) => user.id, [])

  const { items: users, loading, error, deletingId, handleDelete, refetch } = useListPage<User>({
    fetchFn,
    deleteFn,
    getId,
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa người dùng này?',
  })
  const [lockingId, setLockingId] = useState<number | null>(null)

  const handleLock = async (id: number) => {
    try {
      setLockingId(id)
      const response = await userService.lock(id)
      if (response.success) {
        refetch()
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
      if (response.success) {
        refetch()
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

  if (loading) {
    return (
      <AdminLayout title="Người Dùng">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
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

      <ErrorMessage message={error} className="mb-6" />

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

