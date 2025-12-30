'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { PageResponse } from '@/lib/api/types'

interface UsePaginationOptions<T> {
  fetchFn: (params: {
    page: number
    size: number
    sortBy?: string
    sortDir?: 'ASC' | 'DESC'
    search?: string
  }) => Promise<{ success: boolean; data?: PageResponse<T>; error?: string }>
  initialPage?: number
  initialSize?: number
  initialSortBy?: string
  initialSortDir?: 'ASC' | 'DESC'
  debounceMs?: number
}

export function usePagination<T>({
  fetchFn,
  initialPage = 0,
  initialSize = 10,
  initialSortBy = 'createdAt',
  initialSortDir = 'DESC',
  debounceMs = 500,
}: UsePaginationOptions<T>) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [size, setSize] = useState(initialSize)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)
  const [search, setSearch] = useState<string>('')
  const [searchDebounced, setSearchDebounced] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>(initialSortBy)
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>(initialSortDir)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchFn({
        page,
        size,
        sortBy,
        sortDir,
        search: searchDebounced.trim() || undefined,
      })
      
      if (response.success && response.data) {
        const pageData: PageResponse<T> = response.data
        setItems(pageData.content)
        setTotalElements(pageData.totalElements)
        setTotalPages(pageData.totalPages)
        setHasNext(pageData.hasNext)
        setHasPrevious(pageData.hasPrevious)
      } else {
        setError(response.error || 'Không thể tải dữ liệu')
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }, [fetchFn, page, size, sortBy, sortDir, searchDebounced])

  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearchDebounced(search)
      setPage(0) // Reset về trang đầu khi search thay đổi
    }, debounceMs)
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [search, debounceMs])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage)
    }
  }, [totalPages])

  const handleSizeChange = useCallback((newSize: number) => {
    setSize(newSize)
    setPage(0) // Reset về trang đầu khi thay đổi size
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
  }, [])

  const handleSort = useCallback((column: string) => {
    if (sortBy === column) {
      // Nếu đang sắp xếp cột này, toggle hướng sắp xếp
      setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC')
    } else {
      // Nếu chưa sắp xếp cột này, set cột mới và mặc định DESC
      setSortBy(column)
      setSortDir('DESC')
    }
    setPage(0) // Reset về trang đầu khi sắp xếp
  }, [sortBy, sortDir])

  const getSortIcon = useCallback((column: string) => {
    if (sortBy !== column) {
      return null
    }
    return sortDir === 'ASC' ? 'asc' : 'desc'
  }, [sortBy, sortDir])

  // Generate page numbers with ellipsis - memoized
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(0)
      
      if (page <= 2) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages - 1)
      } else if (page >= totalPages - 3) {
        // Near the end
        pages.push('ellipsis')
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i)
        }
      } else {
        // In the middle
        pages.push('ellipsis')
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages - 1)
      }
    }
    
    return pages
  }, [page, totalPages])

  return {
    items,
    loading,
    error,
    page,
    size,
    totalElements,
    totalPages,
    hasNext,
    hasPrevious,
    search,
    sortBy,
    sortDir,
    pageNumbers,
    handlePageChange,
    handleSizeChange,
    handleSearchChange,
    handleSort,
    getSortIcon,
    refetch: fetchItems,
  }
}

