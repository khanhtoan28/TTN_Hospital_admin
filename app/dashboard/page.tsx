'use client'

import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { Award, Archive, Clock, FileText } from 'lucide-react'

export default function DashboardPage() {
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
    <AdminLayout title="Bảng điều khiển">
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
    </AdminLayout>
  )
}

