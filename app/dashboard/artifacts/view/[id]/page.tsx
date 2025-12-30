'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { artifactsService } from '@/lib/api/services'
import { Artifact } from '@/lib/api/types'
import { ArrowLeft, Loader2, Edit } from 'lucide-react'
import Link from 'next/link'

export default function ViewArtifactPage() {
  const { isAuthenticated, loading: authLoading, token } = useAuth()
  const router = useRouter()
  const params = useParams()
  const artifactId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [artifact, setArtifact] = useState<Artifact | null>(null)
  const [imageSrc, setImageSrc] = useState<string>('')

  useEffect(() => {
    // Đợi auth context load xong
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (artifactId) {
      fetchArtifact()
    }
  }, [artifactId, isAuthenticated, authLoading, router])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (artifact && artifact.imageUrl) {
        try {
          const { loadImageWithAuth } = await import('@/lib/utils/loadImageWithAuth')
          const src = await loadImageWithAuth(artifact.imageUrl, token || undefined)
          if (mounted) setImageSrc(src)
        } catch (err) {
          if (mounted) setImageSrc(artifact.imageUrl || '')
        }
      } else {
        if (mounted) setImageSrc('')
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [artifact, token])

  const fetchArtifact = async () => {
    try {
      setLoading(true)
      setError('')
      const id = parseInt(artifactId)

      if (isNaN(id)) {
        setError('ID không hợp lệ')
        return
      }

      const response = await artifactsService.getById(id)
      if (response.success && response.data) {
        setArtifact(response.data)
      } else {
        setError(response.error || 'Không tìm thấy hiện vật')
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <AdminLayout title="Chi tiết Hiện Vật">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-dark" />
        </div>
      </AdminLayout>
    )
  }

  if (error && !artifact) {
    return (
      <AdminLayout title="Chi tiết Hiện Vật">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
        <Link href="/dashboard/artifacts" className="btn-secondary flex items-center space-x-2 w-fit">
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </Link>
      </AdminLayout>
    )
  }

  if (!artifact) {
    return (
      <AdminLayout title="Chi tiết Hiện Vật">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
          Không tìm thấy thông tin hiện vật
        </div>
        <Link href="/dashboard/artifacts" className="btn-secondary flex items-center space-x-2 w-fit">
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </Link>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Chi tiết Hiện Vật">
      <div className="max-w-4xl space-y-6">
        <div className="flex justify-between items-center">
          <Link href="/dashboard/artifacts" className="btn-secondary flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </Link>
          <Link href={`/dashboard/artifacts/${artifact.artifactId}`} className="btn-primary flex items-center space-x-2">
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
          {imageSrc && (
            <div className="flex justify-center">
              <img
                src={imageSrc}
                alt={artifact.artifactName}
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
              <p className="mt-1 text-gray-900">{artifact.artifactId}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Tên hiện vật</label>
              <p className="mt-1 text-gray-900">{artifact.artifactName}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Thời kỳ</label>
              <p className="mt-1 text-gray-900">{artifact.period || '-'}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Loại</label>
              <p className="mt-1 text-gray-900">{artifact.type || '-'}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Không gian</label>
              <p className="mt-1 text-gray-900">{artifact.space || '-'}</p>
            </div>
          </div>

          {artifact.description && (
            <div>
              <label className="text-sm font-semibold text-gray-600">Mô tả</label>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">{artifact.description}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

