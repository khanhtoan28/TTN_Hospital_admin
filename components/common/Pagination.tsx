'use client'

import { memo } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  totalElements: number
  size: number
  hasNext: boolean
  hasPrevious: boolean
  loading: boolean
  pageNumbers: (number | string)[]
  onPageChange: (newPage: number) => void
  onSizeChange: (newSize: number) => void
}

const Pagination = memo(function Pagination({
  page,
  totalPages,
  totalElements,
  size,
  hasNext,
  hasPrevious,
  loading,
  pageNumbers,
  onPageChange,
  onSizeChange,
}: PaginationProps) {
  if (totalPages === 0) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg py-4 z-10" style={{ marginLeft: '256px', paddingLeft: '2rem', paddingRight: '2rem' }}>
      <div className="flex items-center justify-between gap-4">
        {/* Total items */}
        <div className="text-sm text-gray-700">
          Total <span className="font-semibold">{totalElements}</span> items
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-2">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevious || loading}
            className="px-2 py-1.5 border border-gray-300 rounded text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((pageItem, index) => {
              if (pageItem === 'ellipsis') {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-600">
                    ...
                  </span>
                )
              }
              
              const pageNum = pageItem as number
              const isActive = page === pageNum
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  disabled={loading}
                  className={`px-3 py-1.5 border rounded text-sm font-medium min-w-[36px] ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                >
                  {pageNum + 1}
                </button>
              )
            })}
          </div>
          
          {/* Next button */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNext || loading}
            className="px-2 py-1.5 border border-gray-300 rounded text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Items per page dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={size}
              onChange={(e) => onSizeChange(Number(e.target.value))}
              className="appearance-none border border-gray-300 rounded px-3 py-1.5 pr-8 text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Pagination

