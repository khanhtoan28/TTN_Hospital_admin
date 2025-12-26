'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRequireAuth } from './useRequireAuth'

interface UseListPageOptions<T> {
  fetchFn: () => Promise<{ success: boolean; data?: T[]; error?: string }>
  deleteFn: (id: number) => Promise<{ success: boolean; error?: string }>
  getId: (item: T) => number
  deleteConfirmMessage?: string
  deleteSuccessMessage?: string
}

export function useListPage<T>({
  fetchFn,
  deleteFn,
  getId,
  deleteConfirmMessage = 'Bạn có chắc chắn muốn xóa mục này?',
  deleteSuccessMessage,
}: UseListPageOptions<T>) {
  const { isAuthenticated } = useRequireAuth()
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  
  // Use refs to store latest values without causing re-renders
  const fetchFnRef = useRef(fetchFn)
  const deleteFnRef = useRef(deleteFn)
  const getIdRef = useRef(getId)
  
  // Update refs when props change
  useEffect(() => {
    fetchFnRef.current = fetchFn
    deleteFnRef.current = deleteFn
    getIdRef.current = getId
  }, [fetchFn, deleteFn, getId])

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetchFnRef.current()
      if (response.success && response.data) {
        setItems(response.data)
      } else {
        setError(response.error || 'Không thể tải dữ liệu')
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchItems()
    }
  }, [isAuthenticated, fetchItems])

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm(deleteConfirmMessage)) {
      return
    }

    try {
      setDeletingId(id)
      const response = await deleteFnRef.current(id)
      if (response.success) {
        setItems((prevItems) => prevItems.filter((item) => getIdRef.current(item) !== id))
        if (deleteSuccessMessage) {
          alert(deleteSuccessMessage)
        }
      } else {
        alert(response.error || 'Xóa thất bại')
      }
    } catch (err: any) {
      alert(err.message || 'Đã xảy ra lỗi khi xóa')
    } finally {
      setDeletingId(null)
    }
  }, [deleteConfirmMessage, deleteSuccessMessage])

  return {
    items,
    loading,
    error,
    deletingId,
    handleDelete,
    refetch: fetchItems,
  }
}

