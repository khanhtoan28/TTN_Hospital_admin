'use client'

import Link from 'next/link'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LogOut, LayoutDashboard } from 'lucide-react'

export default function AdminHeader() {
  const { username, logout } = useAuth()
  const router = useRouter()

  const handleLogout = useCallback(() => {
    logout()
    router.push('/login')
  }, [logout, router])

  return (
    <header className="bg-primary-dark text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <LayoutDashboard className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-sm text-primary-light">Quản trị hệ thống</p>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Xin chào, <strong>{username}</strong></span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
