'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import ActionButtons from '@/components/common/ActionButtons'
import { useListPage } from '@/hooks/useListPage'
import { artifactsService } from '@/lib/api/services'
import { Artifact } from '@/lib/api/types'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function ArtifactsPage() {
  const router = useRouter()
  const fetchFn = useCallback(() => artifactsService.getAll(), [])
  const deleteFn = useCallback((id: number) => artifactsService.delete(id), [])
  const getId = useCallback((artifact: Artifact) => artifact.artifactId, [])

  const { items: artifacts, loading, error, deletingId, handleDelete } = useListPage<Artifact>({
    fetchFn,
    deleteFn,
    getId,
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa hiện vật này?',
  })

  if (loading) {
    return (
      <AdminLayout title="Hiện Vật">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
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

      <ErrorMessage message={error} className="mb-6" />

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
                <tr 
                  key={artifact.artifactId} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onDoubleClick={() => router.push(`/dashboard/artifacts/view/${artifact.artifactId}`)}
                >
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <ActionButtons
                      editHref={`/dashboard/artifacts/${artifact.artifactId}`}
                      onDelete={() => handleDelete(artifact.artifactId)}
                      deleting={deletingId === artifact.artifactId}
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



