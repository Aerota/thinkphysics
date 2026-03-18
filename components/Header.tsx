'use client'

import { Menu } from 'lucide-react'

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex-1" />
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-medium">
            TP
          </div>
        </div>
      </div>
    </header>
  )
}