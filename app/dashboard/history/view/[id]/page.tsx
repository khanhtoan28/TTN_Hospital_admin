'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { historyService } from '@/lib/api/services'
import { History } from '@/lib/api/types'
import { ArrowLeft, Loader2, Edit } from 'lucide-react'
import Link from 'next/link'

export default function ViewHistoryPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const historyId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<History | null>(null)

  useEffect(() => {
    // Đợi auth context load xong
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (historyId) {
      fetchHistory()
    }
  }, [historyId, isAuthenticated, authLoading, router])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      setError('')
      const id = parseInt(historyId)

      if (isNaN(id)) {
        setError('ID không hợp lệ')
        return
      }

      const response = await historyService.getById(id)
      if (response.success && response.data) {
        setHistory(response.data)
      } else {
        setError(response.error || 'Không tìm thấy mốc lịch sử')
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <AdminLayout title="Chi tiết Mốc Lịch Sử">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-dark" />
        </div>
      </AdminLayout>
    )
  }

  if (error && !history) {
    return (
      <AdminLayout title="Chi tiết Mốc Lịch Sử">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
        <Link href="/dashboard/history" className="btn-secondary flex items-center space-x-2 w-fit">
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </Link>
      </AdminLayout>
    )
  }

  if (!history) {
    return (
      <AdminLayout title="Chi tiết Mốc Lịch Sử">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
          Không tìm thấy thông tin mốc lịch sử
        </div>
        <Link href="/dashboard/history" className="btn-secondary flex items-center space-x-2 w-fit">
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </Link>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Chi tiết Mốc Lịch Sử">
      <div className="max-w-4xl space-y-6">
        <div className="flex justify-between items-center">
          <Link href="/dashboard/history" className="btn-secondary flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </Link>
          <Link href={`/dashboard/history/${history.historyId}`} className="btn-primary flex items-center space-x-2">
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
          {history.image && (
            <div className="flex justify-center">
              <img
                src={history.image}
                alt={history.title}
                className="max-w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-600">ID</label>
              <p className="mt-1 text-gray-900">{history.historyId}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Năm</label>
              <p className="mt-1 text-gray-900">{history.year}</p>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-600">Tiêu đề</label>
              <p className="mt-1 text-gray-900 font-medium">{history.title}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Thời kỳ</label>
              <p className="mt-1 text-gray-900">{history.period || '-'}</p>
            </div>
          </div>

          {history.description && (
            <div>
              <label className="text-sm font-semibold text-gray-600">Mô tả</label>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">{history.description}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

