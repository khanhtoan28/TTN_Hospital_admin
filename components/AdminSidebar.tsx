'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Award, Archive, Clock, FileText, Users, Image as ImageIcon } from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = useMemo(() => [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Sổ Vàng', href: '/dashboard/golden-book', icon: Award },
    { name: 'Hiện Vật', href: '/dashboard/artifacts', icon: Archive },
    { name: 'Lịch Sử', href: '/dashboard/history', icon: Clock },
    { name: 'Giới Thiệu', href: '/dashboard/introduction', icon: FileText },
    { name: 'Kho Ảnh', href: '/dashboard/images', icon: ImageIcon },
    { name: 'Người Dùng', href: '/dashboard/users', icon: Users },
  ], [])

  return (
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
  )
}
