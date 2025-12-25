'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { historyService } from '@/lib/api/services'
import { History } from '@/lib/api/types'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function HistoryPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [histories, setHistories] = useState<History[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistories()
    }
  }, [isAuthenticated])

  const fetchHistories = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await historyService.getAll()
      if (response.success && response.data) {
        setHistories(response.data)
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
    if (!confirm('Bạn có chắc chắn muốn xóa mốc lịch sử này?')) {
      return
    }

    try {
      setDeletingId(id)
      const response = await historyService.delete(id)
      if (response.success) {
        setHistories(histories.filter((history) => history.historyId !== id))
      } else {
        alert(response.error || 'Xóa thất bại')
      }
    } catch (err: any) {
      alert(err.message || 'Đã xảy ra lỗi khi xóa')
    } finally {
      setDeletingId(null)
    }
  }

  if (authLoading || loading) {
    return (
      <AdminLayout title="Lịch Sử">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-dark" />
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

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
                <tr key={history.historyId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{history.historyId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{history.year}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{history.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {history.period || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {history.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/dashboard/history/${history.historyId}`}
                      className="text-primary-dark hover:text-primary-dark/80 inline-flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(history.historyId)}
                      disabled={deletingId === history.historyId}
                      className="text-red-600 hover:text-red-800 inline-flex items-center disabled:opacity-50"
                    >
                      {deletingId === history.historyId ? (
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

