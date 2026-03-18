import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()
    const currentMonth = now.toLocaleString('default', { month: 'long' })
    const currentYear = now.getFullYear()

    // Total students
    const totalStudents = await prisma.student.count()

    // Total revenue (sum of paid payments)
    const paidPayments = await prisma.payment.aggregate({
      where: { paymentStatus: 'Paid' },
      _sum: { totalAmount: true }
    })
    const totalRevenue = paidPayments._sum.totalAmount || 0

    // Pending payments sum and count of students with pending
    const pendingPayments = await prisma.payment.aggregate({
      where: { paymentStatus: 'Pending' },
      _sum: { totalAmount: true }
    })
    const pendingAmount = pendingPayments._sum.totalAmount || 0

    const pendingStudents = await prisma.payment.findMany({
      where: { paymentStatus: 'Pending' },
      select: { studentId: true },
      distinct: ['studentId']
    })
    const pendingStudentsCount = pendingStudents.length

    // Tutes sent this month
    const tutesSentThisMonth = await prisma.tuteSent.count({
      where: { month: currentMonth, year: currentYear }
    })

    // Revenue by month for last 7 months
    const months = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const month = d.toLocaleString('default', { month: 'long' })
      const year = d.getFullYear()
      months.push({ month, year })
    }

    const monthlyRevenue = await Promise.all(months.map(async ({ month, year }) => {
      const sum = await prisma.payment.aggregate({
        where: { month, year, paymentStatus: 'Paid' },
        _sum: { totalAmount: true }
      })
      return {
        month: month.slice(0, 3), // abbreviate
        revenue: sum._sum.totalAmount || 0
      }
    }))

    // Student distribution by batch
    const studentsByBatch = await prisma.student.groupBy({
      by: ['batch'],
      _count: true
    })
    const distribution = studentsByBatch.map(item => ({
      name: item.batch,
      value: item._count
    }))

    // Recent payments (last 5)
    const recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { student: true }
    })
    const recent = recentPayments.map(p => ({
      id: p.id,
      student: p.student.name,
      amount: p.totalAmount,
      status: p.paymentStatus,
      date: p.paymentDate ? p.paymentDate.toISOString().slice(0, 10) : p.createdAt.toISOString().slice(0, 10)
    }))

    return NextResponse.json({
      totalStudents,
      totalRevenue,
      pendingAmount,
      pendingStudentsCount,
      tutesSentThisMonth,
      monthlyRevenue,
      distribution,
      recentPayments: recent
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
