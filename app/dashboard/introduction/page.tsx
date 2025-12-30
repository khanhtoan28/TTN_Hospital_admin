'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import ActionButtons from '@/components/common/ActionButtons'
import { useListPage } from '@/hooks/useListPage'
import { introductionService } from '@/lib/api/services'
import { Introduction } from '@/lib/api/types'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function IntroductionPage() {
  const router = useRouter()
  const fetchFn = useCallback(() => introductionService.getAll(), [])
  const deleteFn = useCallback((id: number) => introductionService.delete(id), [])
  const getId = useCallback((intro: Introduction) => intro.introductionId, [])

  const { items: introductions, loading, error, deletingId, handleDelete } = useListPage<Introduction>({
    fetchFn,
    deleteFn,
    getId,
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa phần giới thiệu này?',
  })

  if (loading) {
    return (
      <AdminLayout title="Giới Thiệu">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
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

      <ErrorMessage message={error} className="mb-6" />

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
                <tr 
                  key={intro.introductionId} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onDoubleClick={() => router.push(`/dashboard/introduction/view/${intro.introductionId}`)}
                >
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <ActionButtons
                      editHref={`/dashboard/introduction/${intro.introductionId}`}
                      onDelete={() => handleDelete(intro.introductionId)}
                      deleting={deletingId === intro.introductionId}
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

