'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { introductionService } from '@/lib/api/services'
import { Introduction } from '@/lib/api/types'
import { ArrowLeft, Loader2, Edit } from 'lucide-react'
import Link from 'next/link'

export default function ViewIntroductionPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const introductionId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [introduction, setIntroduction] = useState<Introduction | null>(null)

  useEffect(() => {
    // Đợi auth context load xong
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (introductionId) {
      fetchIntroduction()
    }
  }, [introductionId, isAuthenticated, authLoading, router])

  const fetchIntroduction = async () => {
    try {
      setLoading(true)
      setError('')
      const id = parseInt(introductionId)

      if (isNaN(id)) {
        setError('ID không hợp lệ')
        return
      }

      const response = await introductionService.getById(id)
      if (response.success && response.data) {
        setIntroduction(response.data)
      } else {
        setError(response.error || 'Không tìm thấy phần giới thiệu')
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <AdminLayout title="Chi tiết Giới Thiệu">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-dark" />
        </div>
      </AdminLayout>
    )
  }

  if (error && !introduction) {
    return (
      <AdminLayout title="Chi tiết Giới Thiệu">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
        <Link href="/dashboard/introduction" className="btn-secondary flex items-center space-x-2 w-fit">
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </Link>
      </AdminLayout>
    )
  }

  if (!introduction) {
    return (
      <AdminLayout title="Chi tiết Giới Thiệu">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
          Không tìm thấy thông tin phần giới thiệu
        </div>
        <Link href="/dashboard/introduction" className="btn-secondary flex items-center space-x-2 w-fit">
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </Link>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Chi tiết Giới Thiệu">
      <div className="max-w-4xl space-y-6">
        <div className="flex justify-between items-center">
          <Link href="/dashboard/introduction" className="btn-secondary flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </Link>
          <Link href={`/dashboard/introduction/${introduction.introductionId}`} className="btn-primary flex items-center space-x-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-600">ID</label>
              <p className="mt-1 text-gray-900">{introduction.introductionId}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Phần</label>
              <p className="mt-1 text-gray-900">{introduction.section}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Ngày tạo</label>
              <p className="mt-1 text-gray-900">
                {introduction.createdAt ? new Date(introduction.createdAt).toLocaleString('vi-VN') : '-'}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Ngày cập nhật</label>
              <p className="mt-1 text-gray-900">
                {introduction.updatedAt ? new Date(introduction.updatedAt).toLocaleString('vi-VN') : '-'}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">Nội dung</label>
            <div className="mt-1 text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
              {introduction.content}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

