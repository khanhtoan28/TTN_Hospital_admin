'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import { useListPage } from '@/hooks/useListPage'
import { goldenBookService } from '@/lib/api/services'
import { GoldenBook } from '@/lib/api/types'
import { BookOpen, Plus, Search, Filter, Edit, Trash2, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function GoldenBookPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  
  const fetchFn = useCallback(() => goldenBookService.getAll(), [])
  const deleteFn = useCallback((id: number) => goldenBookService.delete(id), [])
  const getId = useCallback((book: GoldenBook) => book.goldenBookId, [])

  const { items: books, loading, error, deletingId, handleDelete } = useListPage<GoldenBook>({
    fetchFn,
    deleteFn,
    getId,
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa mục này?',
  })

  // Format ID as #GB-YYYY-XX
  const formatId = (id: number, year: number) => {
    return `#GB-${year}-${String(id).padStart(2, '0')}`
  }

  // Get badge color based on award level
  const getBadgeColor = (level: string) => {
    const levelLower = level.toLowerCase()
    if (levelLower.includes('national') || levelLower.includes('quốc gia')) {
      return 'bg-blue-100 text-blue-700 border border-blue-200'
    } else if (levelLower.includes('provincial') || levelLower.includes('tỉnh')) {
      return 'bg-amber-100 text-amber-700 border border-amber-200'
    } else if (levelLower.includes('city') || levelLower.includes('thành phố')) {
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    }
    return 'bg-gray-100 text-gray-700 border border-gray-200'
  }

  // Filter books based on search
  const filteredBooks = books.filter(book => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      book.goldenBookName.toLowerCase().includes(query) ||
      book.department?.toLowerCase().includes(query) ||
      formatId(book.goldenBookId, book.year).toLowerCase().includes(query)
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex)
  const startEntry = filteredBooks.length > 0 ? startIndex + 1 : 0
  const endEntry = Math.min(endIndex, filteredBooks.length)

  if (loading) {
    return (
      <AdminLayout title="Sổ Vàng">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="">
      <div className="space-y-6" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Quản lý Sổ Vàng</h1>
          </div>
          <Link
            href="/dashboard/golden-book/new"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm mới</span>
          </Link>
        </div>

        <ErrorMessage message={error} className="mb-6" />

        {/* Search and Filter Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, khoa hoặc ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-xl hover:border-blue-500 hover:text-blue-600 flex items-center gap-2 text-gray-700 font-medium transition-all duration-200 focus:outline-none">
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Table */}
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-6 text-lg">Chưa có dữ liệu</p>
              <Link href="/dashboard/golden-book/new" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 inline-flex items-center gap-2 shadow-lg shadow-blue-500/30">
                <Plus className="w-5 h-5" />
                <span>Thêm mục đầu tiên</span>
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-6 overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">TÊN</th>
                      <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">CẤP KHEN</th>
                      <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">NĂM</th>
                      <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">KHOA</th>
                      <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedBooks.map((book) => (
                      <tr 
                        key={book.goldenBookId} 
                        className="hover:bg-blue-50/50 cursor-pointer transition-all duration-150"
                        onDoubleClick={() => router.push(`/dashboard/golden-book/view/${book.goldenBookId}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-center">
                          {formatId(book.goldenBookId, book.year)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">{book.goldenBookName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getBadgeColor(book.level || '')} shadow-sm`}>
                            {book.level || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-center">{book.year}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700 text-center">{book.department || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/dashboard/golden-book/${book.goldenBookId}`}
                              className="w-9 h-9 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </Link>
                            <button
                              onClick={() => handleDelete(book.goldenBookId)}
                              disabled={deletingId === book.goldenBookId}
                              className="w-9 h-9 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                <div className="text-sm text-gray-600 font-medium">
                  Hiển thị <span className="font-bold text-gray-900">{startEntry}</span> đến <span className="font-bold text-gray-900">{endEntry}</span> trong tổng số <span className="font-bold text-gray-900">{filteredBooks.length}</span> mục
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value))
                        setCurrentPage(1)
                      }}
                      className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all duration-200 hover:border-gray-300"
                    >
                      <option value={5}>5 / trang</option>
                      <option value={10}>10 / trang</option>
                      <option value={20}>20 / trang</option>
                      <option value={50}>50 / trang</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 min-w-[40px] border rounded-xl text-sm font-semibold transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg shadow-blue-500/30'
                              : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

