'use client'

import { useCallback, useState, useRef } from 'react'
import AdminLayout from '@/components/AdminLayout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import { useListPage } from '@/hooks/useListPage'
import { imageService } from '@/lib/api/services'
import { Image } from '@/lib/api/types'
import { 
  Plus, Upload, Eye, Trash2, Loader2, FileImage, 
  Edit, X, Download, MoreVertical
} from 'lucide-react'
import Link from 'next/link'

export default function ImagesPage() {
  const fetchFn = useCallback(() => imageService.getAll(), [])
  const deleteFn = useCallback((id: number) => imageService.delete(id), [])
  const getId = useCallback((image: Image) => image.imageId, [])

  const { items: images, loading, error, deletingId, handleDelete, refetch } = useListPage<Image>({
    fetchFn,
    deleteFn,
    getId,
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa ảnh này?',
  })

  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [previewImage, setPreviewImage] = useState<Image | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('')
  const [imageLoading, setImageLoading] = useState(false)
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const multipleFileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleSingleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('Chỉ chấp nhận file ảnh')
      return
    }

    try {
      setUploading(true)
      setUploadError('')
      const response = await imageService.upload(file)
      if (response.success) {
        refetch()
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        setUploadError(response.error || 'Upload thất bại')
      }
    } catch (err: any) {
      setUploadError(err.message || 'Đã xảy ra lỗi khi upload')
    } finally {
      setUploading(false)
    }
  }

  const handleMultipleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const imageFiles = files.filter((file) => file.type.startsWith('image/'))
    if (imageFiles.length === 0) {
      setUploadError('Chỉ chấp nhận file ảnh')
      return
    }

    try {
      setUploading(true)
      setUploadError('')
      const response = await imageService.uploadMultiple(imageFiles)
      if (response.success) {
        refetch()
        if (multipleFileInputRef.current) {
          multipleFileInputRef.current.value = ''
        }
      } else {
        setUploadError(response.error || 'Upload thất bại')
      }
    } catch (err: any) {
      setUploadError(err.message || 'Đã xảy ra lỗi khi upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDoubleClick = async (image: Image) => {
    setPreviewImage(image)
    setImageLoading(true)
    // Load ảnh với Authorization header
    await loadPreviewImageWithAuth(image)
  }

  const loadPreviewImageWithAuth = async (image: Image) => {
    try {
      const token = localStorage.getItem('accessToken')
      const url = imageService.getDownloadUrl(image.imageId)
      
      const response = await fetch(url, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      })

      if (!response.ok) {
        throw new Error('Không thể tải ảnh')
      }

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      setPreviewImageUrl(objectUrl)
      setImageLoading(false)
    } catch (err: any) {
      console.error('Lỗi khi tải ảnh:', err)
      // Fallback: thử dùng URL trực tiếp nếu có
      if (image.url) {
        const { API_CONFIG } = await import('@/lib/api/config')
        setPreviewImageUrl(`${API_CONFIG.BASE_URL}${image.url}`)
      } else {
        setPreviewImageUrl(imageService.getDownloadUrl(image.imageId))
      }
      setImageLoading(false)
    }
  }

  // Preload image khi hover vào row để tăng tốc độ load
  const handleRowHover = useCallback((image: Image) => {
    if (!preloadedImages.has(image.imageId)) {
      const img = new window.Image()
      const token = localStorage.getItem('accessToken')
      const url = imageService.getDownloadUrl(image.imageId)
      
      img.onload = () => {
        setPreloadedImages(prev => new Set(prev).add(image.imageId))
      }
      
      // Preload với token để cache sẵn
      if (token) {
        fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          cache: 'force-cache'
        })
          .then(res => res.blob())
          .then(blob => {
            const objectUrl = URL.createObjectURL(blob)
            img.src = objectUrl
            // Cleanup sau 10 phút
            setTimeout(() => URL.revokeObjectURL(objectUrl), 600000)
          })
          .catch(() => {
            // Fallback nếu fetch fail
            img.src = url
          })
      } else {
        img.src = url
      }
    }
  }, [preloadedImages])

  const handleDownload = async (image: Image) => {
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
      setUploadError(err.message || 'Đã xảy ra lỗi khi tải xuống')
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Kho Ảnh">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Quản lý Kho Ảnh">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Tổng số: {images.length} ảnh</p>
        <div className="flex space-x-3">
          <label className="btn-primary flex items-center space-x-2 cursor-pointer">
            <Upload className="w-5 h-5" />
            <span>Upload 1 ảnh</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleSingleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <label className="btn-primary flex items-center space-x-2 cursor-pointer">
            <Upload className="w-5 h-5" />
            <span>Upload nhiều ảnh</span>
            <input
              ref={multipleFileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <ErrorMessage message={error || uploadError} className="mb-6" />

      {uploading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Đang upload ảnh...</span>
        </div>
      )}

      {images.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">Chưa có ảnh nào trong kho</p>
          <label className="btn-primary inline-flex items-center space-x-2 cursor-pointer">
            <Upload className="w-5 h-5" />
            <span>Upload ảnh đầu tiên</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleSingleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chủ sở hữu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày sửa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kích thước
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {images.map((image) => (
                <tr
                  key={image.imageId}
                  onDoubleClick={() => handleDoubleClick(image)}
                  onMouseEnter={() => handleRowHover(image)}
                  className="group hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <FileImage className="w-8 h-8 text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" title={image.originalFilename}>
                          {image.originalFilename}
                        </p>
                        {image.description && (
                          <p className="text-xs text-gray-500 truncate mt-1">{image.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">Tôi</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {new Date(image.updatedAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{formatFileSize(image.fileSize)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDoubleClick(image)
                        }}
                        className="p-2 text-gray-600 hover:text-primary-dark hover:bg-gray-100 rounded transition-colors"
                        title="Xem ảnh"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(image)
                        }}
                        className="p-2 text-gray-600 hover:text-primary-dark hover:bg-gray-100 rounded transition-colors"
                        title="Tải xuống"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/dashboard/images/${image.imageId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-gray-600 hover:text-primary-dark hover:bg-gray-100 rounded transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(image.imageId)
                        }}
                        disabled={deletingId === image.imageId}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        title="Xóa"
                      >
                        {deletingId === image.imageId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Preview Image - Giống Drive */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => {
            // Cleanup blob URL khi đóng modal
            if (previewImageUrl && previewImageUrl.startsWith('blob:')) {
              URL.revokeObjectURL(previewImageUrl)
            }
            setPreviewImage(null)
            setPreviewImageUrl('')
          }}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image with Loading State */}
            <div className="relative w-full h-full flex items-center justify-center">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
              )}
              {previewImageUrl ? (
                <img
                  key={previewImage.imageId}
                  src={previewImageUrl}
                  alt={previewImage.originalFilename}
                  className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl image-optimized transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  onLoad={() => {
                    setImageLoading(false)
                    setPreloadedImages(prev => new Set(prev).add(previewImage.imageId))
                  }}
                  onError={(e) => {
                    console.error('Lỗi khi hiển thị ảnh')
                    // Fallback nếu blob URL fail
                    const target = e.target as HTMLImageElement
                    if (previewImage.url) {
                      const { API_CONFIG } = require('@/lib/api/config')
                      target.src = `${API_CONFIG.BASE_URL}${previewImage.url}`
                    } else {
                      target.src = imageService.getDownloadUrl(previewImage.imageId)
                    }
                    setImageLoading(false)
                  }}
                  onLoadStart={() => {
                    if (!preloadedImages.has(previewImage.imageId)) {
                      setImageLoading(true)
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
              )}
            </div>

            {/* Image Info Bar */}
            <div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 rounded-lg px-6 py-3 flex items-center space-x-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{previewImage.originalFilename}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(previewImage.fileSize)} • {new Date(previewImage.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="flex items-center space-x-2 border-l border-gray-300 pl-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload(previewImage)
                  }}
                  className="p-2 text-gray-600 hover:text-primary-dark hover:bg-gray-100 rounded transition-colors"
                  title="Tải xuống"
                >
                  <Download className="w-5 h-5" />
                </button>
                <Link
                  href={`/dashboard/images/${previewImage.imageId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-gray-600 hover:text-primary-dark hover:bg-gray-100 rounded transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(previewImage.imageId)
                    setPreviewImage(null)
                  }}
                  disabled={deletingId === previewImage.imageId}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  title="Xóa"
                >
                  {deletingId === previewImage.imageId ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
