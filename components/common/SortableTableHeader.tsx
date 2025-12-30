'use client'

import { memo } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface SortableTableHeaderProps {
  column: string
  label: string
  currentSortBy: string
  currentSortDir: 'ASC' | 'DESC'
  onSort: (column: string) => void
  className?: string
}

const SortableTableHeader = memo(function SortableTableHeader({
  column,
  label,
  currentSortBy,
  currentSortDir,
  onSort,
  className = '',
}: SortableTableHeaderProps) {
  const isActive = currentSortBy === column
  
  return (
    <th 
      className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-primary-dark/90 transition-colors ${className}`}
      onClick={() => onSort(column)}
    >
      <div className="flex items-center justify-center gap-2">
        <span>{label}</span>
        {isActive ? (
          currentSortDir === 'ASC' 
            ? <ArrowUp className="w-4 h-4 text-primary-dark" />
            : <ArrowDown className="w-4 h-4 text-primary-dark" />
        ) : (
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
        )}
      </div>
    </th>
  )
})

export default SortableTableHeader

