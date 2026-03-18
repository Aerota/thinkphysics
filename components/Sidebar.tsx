'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  FileText,
  Package,
  UserCircle,
  Settings,
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Students', href: '/dashboard/students', icon: UserCircle },
    { name: 'Tutes', href: '/dashboard/tutes', icon: Package },
    { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-red-600">Think Physics</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}