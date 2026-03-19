import { prisma } from '@/lib/prisma'

export async function getDashboardStats() {
  const now = new Date()
  const currentMonth = now.toLocaleString('default', { month: 'long' })
  const currentYear = now.getFullYear()

  const totalStudents = await prisma.student.count()

  const paidPayments = await prisma.payment.aggregate({
    where: { paymentStatus: 'Paid' },
    _sum: { totalAmount: true }
  })
  const totalRevenue = paidPayments._sum.totalAmount || 0

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

  const tutesSentThisMonth = await prisma.tuteSent.count({
    where: { month: currentMonth, year: currentYear }
  })

  // ... rest of the calculations (monthlyRevenue, distribution, recentPayments)
  // Copy from the stats API file

  return {
    totalStudents,
    totalRevenue,
    pendingAmount,
    pendingStudentsCount,
    tutesSentThisMonth,
    // ... other fields
  }
}