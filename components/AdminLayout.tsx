'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LayoutDashboard, Award, Archive, Clock, FileText, LogOut, ArrowLeft } from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
  title: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { username, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Sổ Vàng', href: '/dashboard/golden-book', icon: Award },
    { name: 'Hiện Vật', href: '/dashboard/artifacts', icon: Archive },
    { name: 'Lịch Sử', href: '/dashboard/history', icon: Clock },
    { name: 'Giới Thiệu', href: '/dashboard/introduction', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-80px)]">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-dark text-white'
                      : 'text-primary-dark hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-6">
            {pathname !== '/dashboard' && (
              <Link
                href="/dashboard"
                className="inline-flex items-center text-primary-dark hover:text-primary-dark/80 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Về Dashboard
              </Link>
            )}
            <h2 className="text-3xl font-bold text-primary-dark">{title}</h2>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}

