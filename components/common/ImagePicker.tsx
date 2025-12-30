'use client'

import { useState, useEffect, useCallback } from 'react'
import { imageService } from '@/lib/api/services'
import { Image } from '@/lib/api/types'
import { X, Search, Loader2, ImageIcon } from 'lucide-react'
import { API_CONFIG } from '@/lib/api/config'
import { API_ENDPOINTS } from '@/lib/api/config'

interface ImagePickerProps {
  value?: number | string
  imageUrl?: string
  onSelect: (imageId: number | null, imageUrl: string | null) => void
  label?: string
  placeholder?: string
  className?: string
}

export default function ImagePicker({
  value,
  imageUrl,
  onSelect,
  label = 'Hình ảnh',
  placeholder = 'Chọn từ bộ sưu tập hoặc nhập URL',
  className = '',
}: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  const [manualUrl, setManualUrl] = useState('')
  const [useManualUrl, setUseManualUrl] = useState(false)

  useEffect(() => {
    if (value && typeof value === 'number') {
      fetchSelectedImage(value)
    } else if (imageUrl) {
      setManualUrl(imageUrl)
      setUseManualUrl(true)
    }
  }, [value, imageUrl])

  const fetchSelectedImage = async (imageId: number) => {
    try {
      const response = await imageService.getById(imageId)
      if (response.success && response.data) {
        setSelectedImage(response.data)
        setUseManualUrl(false)
      }
    } catch (err) {
      console.error('Error fetching image:', err)
    }
  }

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true)
      const response = await imageService.getAll()
      if (response.success && response.data) {
        setImages(response.data)
      }
    } catch (err) {
      console.error('Error fetching images:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchImages()
    }
  }, [isOpen, fetchImages])

  const filteredImages = images.filter((img) =>
    img.originalFilename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleImageSelect = (image: Image) => {
    setSelectedImage(image)
    setUseManualUrl(false)
    setManualUrl('')
    onSelect(image.imageId, null)
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelectedImage(null)
    setManualUrl('')
    setUseManualUrl(false)
    onSelect(null, null)
  }

  const handleManualUrlChange = (url: string) => {
    setManualUrl(url)
    setUseManualUrl(true)
    setSelectedImage(null)
    onSelect(null, url)
  }

  const getImageUrl = (image: Image): string => {
    return `${API_CONFIG.BASE_URL}${image.url}`
  }

  return (
    <div className={className}>
      <label className="label-field">{label}</label>
      <div className="space-y-2">
        {/* Preview */}
        {(selectedImage || (useManualUrl && manualUrl)) && (
          <div className="relative inline-block">
            <img
              src={selectedImage ? getImageUrl(selectedImage) : manualUrl}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Chọn từ bộ sưu tập</span>
          </button>
          {!selectedImage && (
            <input
              type="url"
              value={manualUrl}
              onChange={(e) => handleManualUrlChange(e.target.value)}
              className="input-field flex-1"
              placeholder={placeholder}
              maxLength={500}
            />
          )}
        </div>

        {/* Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Chọn hình ảnh</h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm hình ảnh..."
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Image Grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-dark" />
                  </div>
                ) : filteredImages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Không tìm thấy hình ảnh nào
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {filteredImages.map((image) => (
                      <div
                        key={image.imageId}
                        onClick={() => handleImageSelect(image)}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage?.imageId === image.imageId
                            ? 'border-primary-dark ring-2 ring-primary-dark'
                            : 'border-gray-200 hover:border-primary-dark'
                        }`}
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={image.originalFilename}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-2 bg-white">
                          <p className="text-xs text-gray-600 truncate">
                            {image.originalFilename}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

