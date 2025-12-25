'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Award, Archive, Clock, FileText, LogOut, LayoutDashboard } from 'lucide-react'

export default function DashboardPage() {
  const { isAuthenticated, username, logout, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const menuItems = [
    {
      title: 'Sổ Vàng',
      description: 'Quản lý bằng khen, giấy khen',
      icon: Award,
      href: '/dashboard/golden-book',
      color: 'bg-yellow-500',
    },
    {
      title: 'Hiện Vật',
      description: 'Quản lý hiện vật trưng bày',
      icon: Archive,
      href: '/dashboard/artifacts',
      color: 'bg-blue-500',
    },
    {
      title: 'Lịch Sử',
      description: 'Quản lý các mốc lịch sử',
      icon: Clock,
      href: '/dashboard/history',
      color: 'bg-green-500',
    },
    {
      title: 'Giới Thiệu',
      description: 'Quản lý nội dung giới thiệu',
      icon: FileText,
      href: '/dashboard/introduction',
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-dark text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-sm text-primary-light">Quản trị hệ thống</p>
              </div>
            </div>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-primary-dark mb-8">
          Bảng điều khiển
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="card hover:scale-105 transition-transform cursor-pointer"
              >
                <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary-dark mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}

