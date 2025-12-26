'use client'

import { useCallback } from 'react'
import AdminLayout from '@/components/AdminLayout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import ActionButtons from '@/components/common/ActionButtons'
import { useListPage } from '@/hooks/useListPage'
import { goldenBookService } from '@/lib/api/services'
import { GoldenBook } from '@/lib/api/types'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function GoldenBookPage() {
  const fetchFn = useCallback(() => goldenBookService.getAll(), [])
  const deleteFn = useCallback((id: number) => goldenBookService.delete(id), [])
  const getId = useCallback((book: GoldenBook) => book.goldenBookId, [])

  const { items: books, loading, error, deletingId, handleDelete } = useListPage<GoldenBook>({
    fetchFn,
    deleteFn,
    getId,
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa mục này?',
  })

  if (loading) {
    return (
      <AdminLayout title="Sổ Vàng">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Quản lý Sổ Vàng">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Tổng số: {books.length} mục</p>
        <Link
          href="/dashboard/golden-book/new"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm mới</span>
        </Link>
      </div>

      <ErrorMessage message={error} className="mb-6" />

      {books.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">Chưa có dữ liệu</p>
          <Link href="/dashboard/golden-book/new" className="btn-primary inline-flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Thêm mục đầu tiên</span>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-primary-dark text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cấp</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Năm</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Khoa</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.map((book) => (
                <tr 
                  key={book.goldenBookId} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onDoubleClick={() => window.location.href = `/dashboard/golden-book/view/${book.goldenBookId}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.goldenBookId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{book.goldenBookName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{book.level}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{book.year}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{book.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <ActionButtons
                      editHref={`/dashboard/golden-book/${book.goldenBookId}`}
                      onDelete={() => handleDelete(book.goldenBookId)}
                      deleting={deletingId === book.goldenBookId}
                    />
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

