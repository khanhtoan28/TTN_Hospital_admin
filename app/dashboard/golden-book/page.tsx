'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AdminLayout from '@/components/AdminLayout'
import { goldenBookService } from '@/lib/api/services'
import { GoldenBook } from '@/lib/api/types'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function GoldenBookPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [books, setBooks] = useState<GoldenBook[]>([])
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
      fetchBooks()
    }
  }, [isAuthenticated])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await goldenBookService.getAll()
      if (response.success && response.data) {
        setBooks(response.data)
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
    if (!confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      return
    }

    try {
      setDeletingId(id)
      const response = await goldenBookService.delete(id)
      if (response.success) {
        setBooks(books.filter((book) => book.goldenBookId !== id))
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
      <AdminLayout title="Sổ Vàng">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-dark" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Quản lý Sổ Vàng">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Tổng số: {books.length} mục</p>
        <Link
          href="/dashboard/golden-book/new"
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

      {books.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">Chưa có dữ liệu</p>
          <Link href="/dashboard/golden-book/new" className="btn-primary inline-flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Thêm mục đầu tiên</span>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-primary-dark text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cấp</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Năm</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Khoa</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book.goldenBookId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.goldenBookId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{book.goldenBookName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{book.level}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{book.year}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{book.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/dashboard/golden-book/${book.goldenBookId}`}
                      className="text-primary-dark hover:text-primary-dark/80 inline-flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(book.goldenBookId)}
                      disabled={deletingId === book.goldenBookId}
                      className="text-red-600 hover:text-red-800 inline-flex items-center disabled:opacity-50"
                    >
                      {deletingId === book.goldenBookId ? (
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

