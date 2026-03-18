'use client'

import { Users, BookOpen, CreditCard, TrendingUp } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const monthlyData = [
  { month: 'Jan', revenue: 41000 },
  { month: 'Feb', revenue: 82000 },
  { month: 'Mar', revenue: 123000 },
  { month: 'Apr', revenue: 164000 },
  { month: 'May', revenue: 205000 },
  { month: 'Jun', revenue: 246000 },
  { month: 'Jul', revenue: 287000 },
]

const batchDistribution = [
  { name: '2028 AL', value: 45, color: '#ef4444' },
  { name: '2027 AL', value: 25, color: '#f87171' },
]

const recentPayments = [
  { id: 1, student: 'Kamal Perera', amount: 4100, status: 'Paid', date: '2024-01-15' },
  { id: 2, student: 'Nimal Silva', amount: 4100, status: 'Pending', date: '2024-01-14' },
  { id: 3, student: 'Sunil Fernando', amount: 4100, status: 'Paid', date: '2024-01-13' },
]

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">128</p>
              <p className="text-xs text-green-500 mt-1">+5.2% vs last month</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        {/* other stat cards... (copy from earlier) */}
      </div>
      {/* charts and table... (copy from earlier) */}
    </div>
  )
}
