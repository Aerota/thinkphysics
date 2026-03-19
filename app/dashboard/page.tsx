'use client'

import { useEffect, useState } from 'react'
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
  { month: 'Jan', revenue: 41000, students: 10 },
  { month: 'Feb', revenue: 82000, students: 20 },
  { month: 'Mar', revenue: 123000, students: 30 },
  { month: 'Apr', revenue: 164000, students: 40 },
  { month: 'May', revenue: 205000, students: 50 },
  { month: 'Jun', revenue: 246000, students: 60 },
  { month: 'Jul', revenue: 287000, students: 70 },
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
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-green-500 mt-1">+5.2% vs last month</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">LKR 4100</p>
              <p className="text-xs text-green-500 mt-1">+2.08% vs last month</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Payments</p>
              <p className="text-2xl font-bold">LKR 32,800</p>
              <p className="text-xs text-red-500 mt-1">8 students pending</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tutes Sent</p>
              <p className="text-2xl font-bold">156</p>
              <p className="text-xs text-red-500 mt-1">This month</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Student Distribution by Batch</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={batchDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#ef4444"
                dataKey="value"
              >
                {batchDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Student</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{payment.student}</td>
                  <td className="py-3 px-4">LKR {payment.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{payment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
