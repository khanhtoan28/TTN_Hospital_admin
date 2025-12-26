'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import { imageService } from '@/lib/api/services'
import { Image } from '@/lib/api/types'
import { Save, X, Upload, Loader2, Download } from 'lucide-react'
import Link from 'next/link'

export default function EditImagePage() {
  const router = useRouter()
  const params = useParams()
  const imageId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [image, setImage] = useState<Image | null>(null)
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (imageId) {
      fetchImage()
    }
  }, [imageId])

  const fetchImage = async () => {
    try {
      setLoading(true)
      setError('')
      const id = parseInt(imageId)
      
      if (isNaN(id)) {
        setError('ID không hợp lệ')
        return
      }

      const response = await imageService.getById(id)
      if (response.success && response.data) {
        setImage(response.data)
        setDescription(response.data.description || '')
      } else {
        setError(response.error || 'Không tìm thấy ảnh')
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDescription = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image) return

    try {
      setSaving(true)
      setError('')
      const response = await imageService.update(image.imageId, description)
      if (response.success && response.data) {
        alert('Cập nhật mô tả thành công')
        router.push('/dashboard/images')
      } else {
        setError(response.error || 'Cập nhật thất bại')
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi')
    } finally {
      setSaving(false)
    }
  }

  const handleDownload = async () => {
    if (!image) return

    try {
      const token = localStorage.getItem('accessToken')
      const url = imageService.getDownloadUrl(image.imageId)
      
      const response = await fetch(url, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      })

      if (!response.ok) {
        throw new Error('Không thể tải xuống ảnh')
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = image.originalFilename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải xuống')
    }
  }

  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !image) return

    if (!file.type.startsWith('image/')) {
      setError('Chỉ chấp nhận file ảnh')
      return
    }

    try {
      setUploading(true)
      setError('')
      const response = await imageService.replace(image.imageId, file)
      if (response.success && response.data) {
        setImage(response.data)
        alert('Thay thế ảnh thành công')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        setError(response.error || 'Thay thế ảnh thất bại')
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi thay thế ảnh')
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <AdminLayout title="Chi tiết Ảnh">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  if (error && !image) {
    return (
      <AdminLayout title="Chi tiết Ảnh">
        <ErrorMessage message={error} className="mb-6" />
        <Link href="/dashboard/images" className="btn-secondary">
          Quay lại danh sách
        </Link>
      </AdminLayout>
    )
  }

  if (!image) return null

  return (
    <AdminLayout title="Chi tiết Ảnh">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Image */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-bold text-primary-dark mb-4">Xem trước</h3>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={imageService.getDownloadUrl(image.imageId)}
                alt={image.originalFilename}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tên file:</span>
                <span className="font-medium">{image.originalFilename}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kích thước:</span>
                <span className="font-medium">{formatFileSize(image.fileSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loại:</span>
                <span className="font-medium">{image.contentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày tạo:</span>
                <span className="font-medium">{new Date(image.createdAt).toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cập nhật:</span>
                <span className="font-medium">{new Date(image.updatedAt).toLocaleString('vi-VN')}</span>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleDownload}
                className="btn-primary inline-flex items-center space-x-2 w-full justify-center"
              >
                <Download className="w-5 h-5" />
                <span>Tải xuống</span>
              </button>
            </div>
          </div>

          {/* Replace Image */}
          <div className="card">
            <h3 className="text-lg font-bold text-primary-dark mb-4">Thay thế ảnh</h3>
            <label className="btn-secondary flex items-center space-x-2 cursor-pointer w-full justify-center">
              <Upload className="w-5 h-5" />
              <span>{uploading ? 'Đang thay thế...' : 'Chọn ảnh mới'}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleReplaceImage}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {uploading && (
              <div className="mt-4 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary-dark" />
              </div>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-bold text-primary-dark mb-4">Thông tin ảnh</h3>
            <form onSubmit={handleUpdateDescription} className="space-y-4">
              <ErrorMessage message={error} />

              <div>
                <label htmlFor="description" className="label-field">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                  rows={6}
                  maxLength={500}
                  placeholder="Nhập mô tả cho ảnh..."
                />
                <p className="text-xs text-gray-500 mt-1">{description.length}/500 ký tự</p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>{saving ? 'Đang lưu...' : 'Lưu mô tả'}</span>
                </button>
                <Link href="/dashboard/images" className="btn-secondary flex items-center space-x-2">
                  <X className="w-5 h-5" />
                  <span>Hủy</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

