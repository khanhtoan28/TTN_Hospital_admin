'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { artifactsService } from '@/lib/api/services'
import { Artifact } from '@/lib/api/types'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ArtifactsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
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
      fetchArtifacts()
    }
  }, [isAuthenticated])

  const fetchArtifacts = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await artifactsService.getAll()
      if (response.success && response.data) {
        setArtifacts(response.data)
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
    if (!confirm('Bạn có chắc chắn muốn xóa hiện vật này?')) {
      return
    }

    try {
      setDeletingId(id)
      const response = await artifactsService.delete(id)
      if (response.success) {
        setArtifacts(artifacts.filter((artifact) => artifact.artifactId !== id))
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
      <AdminLayout title="Hiện Vật">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-dark" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Quản lý Hiện Vật">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Tổng số: {artifacts.length} hiện vật</p>
        <Link
          href="/dashboard/artifacts/new"
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

      {artifacts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">Chưa có dữ liệu hiện vật</p>
          <Link href="/dashboard/artifacts/new" className="btn-primary inline-flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Thêm hiện vật đầu tiên</span>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-primary-dark text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tên hiện vật</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mô tả</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Thời kỳ</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Không gian</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {artifacts.map((artifact) => (
                <tr key={artifact.artifactId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{artifact.artifactId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{artifact.artifactName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {artifact.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {artifact.period || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {artifact.type || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {artifact.space || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/dashboard/artifacts/${artifact.artifactId}`}
                      className="text-primary-dark hover:text-primary-dark/80 inline-flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(artifact.artifactId)}
                      disabled={deletingId === artifact.artifactId}
                      className="text-red-600 hover:text-red-800 inline-flex items-center disabled:opacity-50"
                    >
                      {deletingId === artifact.artifactId ? (
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



