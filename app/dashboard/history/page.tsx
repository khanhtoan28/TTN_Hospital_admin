'use client'

import { useCallback } from 'react'
import AdminLayout from '@/components/AdminLayout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import ActionButtons from '@/components/common/ActionButtons'
import { useListPage } from '@/hooks/useListPage'
import { historyService } from '@/lib/api/services'
import { History } from '@/lib/api/types'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function HistoryPage() {
  const fetchFn = useCallback(() => historyService.getAll(), [])
  const deleteFn = useCallback((id: number) => historyService.delete(id), [])
  const getId = useCallback((history: History) => history.historyId, [])

  const { items: histories, loading, error, deletingId, handleDelete } = useListPage<History>({
    fetchFn,
    deleteFn,
    getId,
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa mốc lịch sử này?',
  })

  if (loading) {
    return (
      <AdminLayout title="Lịch Sử">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Quản lý Lịch Sử">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Tổng số: {histories.length} mốc lịch sử</p>
        <Link
          href="/dashboard/history/new"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm mới</span>
        </Link>
      </div>

      <ErrorMessage message={error} className="mb-6" />

      {histories.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">Chưa có dữ liệu lịch sử</p>
          <Link href="/dashboard/history/new" className="btn-primary inline-flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Thêm mốc lịch sử đầu tiên</span>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-primary-dark text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Năm</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tiêu đề</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Giai đoạn</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mô tả</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {histories.map((history) => (
                <tr 
                  key={history.historyId} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onDoubleClick={() => window.location.href = `/dashboard/history/view/${history.historyId}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{history.historyId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{history.year}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{history.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {history.period || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {history.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <ActionButtons
                      editHref={`/dashboard/history/${history.historyId}`}
                      onDelete={() => handleDelete(history.historyId)}
                      deleting={deletingId === history.historyId}
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

