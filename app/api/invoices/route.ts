import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')
  const year = searchParams.get('year')
  const batch = searchParams.get('batch')

  try {
    const where: any = {}
    if (month) where.month = month
    if (year) where.year = parseInt(year)
    if (batch && batch !== 'all') where.batch = batch

    const payments = await prisma.payment.findMany({
      where,
      include: {
        student: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Format for frontend
    const invoices = payments.map(p => ({
      id: p.id,
      invoiceNo: p.invoiceNo,
      studentName: p.student.name,
      studentId: p.student.studentId,
      address: `${p.student.addressLine1}, ${p.student.addressLine2 ? p.student.addressLine2 + ', ' : ''}${p.student.city}, Sri Lanka`,
      batch: p.student.batch,
      month: p.month,
      year: p.year,
      classFee: p.classFee,
      courierFee: p.courierFee,
      totalAmount: p.totalAmount,
      status: p.paymentStatus,
      trackingId: p.trackingId || '',
      paymentDate: p.paymentDate ? p.paymentDate.toISOString().slice(0,10) : undefined,
      // We don't have tute list in Payment model, so we'll leave it empty or fetch separately
      tutes: []
    }))

    return NextResponse.json(invoices)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
  }
}