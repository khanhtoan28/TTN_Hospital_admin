'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { introductionService } from '@/lib/api/services'
import { Introduction } from '@/lib/api/types'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function IntroductionPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [introductions, setIntroductions] = useState<Introduction[]>([])
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
      fetchIntroductions()
    }
  }, [isAuthenticated])

  const fetchIntroductions = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await introductionService.getAll()
      if (response.success && response.data) {
        setIntroductions(response.data)
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
    if (!confirm('Bạn có chắc chắn muốn xóa phần giới thiệu này?')) {
      return
    }

    try {
      setDeletingId(id)
      const response = await introductionService.delete(id)
      if (response.success) {
        setIntroductions(introductions.filter((intro) => intro.introductionId !== id))
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
      <AdminLayout title="Giới Thiệu">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-dark" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Quản lý Giới Thiệu">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Tổng số: {introductions.length} phần giới thiệu</p>
        <Link
          href="/dashboard/introduction/new"
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

      {introductions.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">Chưa có dữ liệu giới thiệu</p>
          <Link href="/dashboard/introduction/new" className="btn-primary inline-flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Thêm phần giới thiệu đầu tiên</span>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-primary-dark text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phần</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nội dung</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ngày cập nhật</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {introductions.map((intro) => (
                <tr key={intro.introductionId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{intro.introductionId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{intro.section}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                    {intro.content || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(intro.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(intro.updatedAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/dashboard/introduction/${intro.introductionId}`}
                      className="text-primary-dark hover:text-primary-dark/80 inline-flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(intro.introductionId)}
                      disabled={deletingId === intro.introductionId}
                      className="text-red-600 hover:text-red-800 inline-flex items-center disabled:opacity-50"
                    >
                      {deletingId === intro.introductionId ? (
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

