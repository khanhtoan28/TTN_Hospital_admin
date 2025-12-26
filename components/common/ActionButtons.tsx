'use client'

import Link from 'next/link'
import { Edit, Trash2, Loader2 } from 'lucide-react'

interface ActionButtonsProps {
  editHref: string
  onDelete: () => void
  deleting?: boolean
  deleteLabel?: string
  editLabel?: string
}

export default function ActionButtons({
  editHref,
  onDelete,
  deleting = false,
  deleteLabel = 'Xóa',
  editLabel = 'Sửa',
}: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-end space-x-2">
      <Link
        href={editHref}
        className="text-primary-dark hover:text-primary-dark/80 inline-flex items-center"
      >
        <Edit className="w-4 h-4 mr-1" />
        {editLabel}
      </Link>
      <button
        onClick={onDelete}
        disabled={deleting}
        className="text-red-600 hover:text-red-800 inline-flex items-center disabled:opacity-50"
      >
        {deleting ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4 mr-1" />
        )}
        {deleteLabel}
      </button>
    </div>
  )
}

