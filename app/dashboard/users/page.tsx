'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import Pagination from '@/components/common/Pagination'
import SortableTableHeader from '@/components/common/SortableTableHeader'
import { usePagination } from '@/hooks/usePagination'
import { userService } from '@/lib/api/services'
import { User } from '@/lib/api/types'
import { Edit, Trash2, Loader2, Lock, Unlock, Plus, Search } from 'lucide-react'
import Link from 'next/link'

export default function UsersPage() {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [lockingId, setLockingId] = useState<number | null>(null)

  const {
    items: users,
    loading,
    error,
    page,
    size,
    totalElements,
    totalPages,
    hasNext,
    hasPrevious,
    search,
    sortBy,
    sortDir,
    pageNumbers,
    handlePageChange,
    handleSizeChange,
    handleSearchChange,
    handleSort,
    refetch,
  } = usePagination<User>({
    fetchFn: useCallback((params) => userService.getAllPaginated(params), []),
    initialSortBy: 'createdAt',
    initialSortDir: 'DESC',
  })

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return
    }
    
    try {
      setDeletingId(id)
      const response = await userService.delete(id)
      if (response.success) {
        refetch()
      } else {
        alert(response.error || 'Xóa người dùng thất bại')
      }
    } catch (err: any) {
      alert(err.message || 'Đã xảy ra lỗi khi xóa người dùng')
    } finally {
      setDeletingId(null)
    }
  }, [refetch])

  const handleLock = useCallback(async (id: number) => {
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
  }, [refetch])

  const handleUnlock = useCallback(async (id: number) => {
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
  }, [refetch])

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
      <div className="mb-6 flex justify-between items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Tìm kiếm người dùng..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
            />
          </div>

        </div>

        <Link
          href="/dashboard/users/new"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm mới</span>
        </Link>
      </div>

      <ErrorMessage message={error || ''} className="mb-6" />

      <div className="pb-24">
        {users.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">Chưa có dữ liệu người dùng</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-8 px-8">
            <table className="w-full bg-white shadow-lg" style={{ minWidth: '100%' }}>
            <thead className="bg-primary-dark text-white">
              <tr>
                <SortableTableHeader
                  column="userId"
                  label="ID"
                  currentSortBy={sortBy}
                  currentSortDir={sortDir}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  column="username"
                  label="Tên đăng nhập"
                  currentSortBy={sortBy}
                  currentSortDir={sortDir}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  column="fullname"
                  label="Họ và tên"
                  currentSortBy={sortBy}
                  currentSortDir={sortDir}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  column="email"
                  label="Email"
                  currentSortBy={sortBy}
                  currentSortDir={sortDir}
                  onSort={handleSort}
                />
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Số điện thoại</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onDoubleClick={() => router.push(`/dashboard/users/view/${user.id}`)}
                >
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className="text-primary-dark hover:text-primary-dark/80 inline-flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Link>
                    {user.isLocked ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUnlock(user.id)
                        }}
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
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLock(user.id)
                        }}
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
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(user.id)
                      }}
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
      </div>

      {/* Pagination - Fixed at bottom */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        size={size}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        loading={loading}
        pageNumbers={pageNumbers}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
      />
    </AdminLayout>
  )
}

