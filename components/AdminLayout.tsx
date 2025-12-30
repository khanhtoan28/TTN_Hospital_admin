'use client'

import { ReactNode } from 'react'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import AdminHeader from '@/components/AdminHeader'
import AdminSidebar from '@/components/AdminSidebar'

interface AdminLayoutProps {
  children: ReactNode
  title: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { loading } = useRequireAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-primary-dark">{title}</h2>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}

