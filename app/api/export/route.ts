import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  let data: any[] = []
  let filename = ''
  let headers: string[] = []

  try {
    if (type === 'students') {
      data = await prisma.student.findMany()
      headers = ['id', 'studentId', 'name', 'addressLine1', 'addressLine2', 'city', 'batch', 'contactNo', 'email', 'createdAt']
      filename = 'students.csv'
    } else if (type === 'payments') {
      const payments = await prisma.payment.findMany({ include: { student: true } })
      data = payments.map(p => ({
        invoiceNo: p.invoiceNo,
        studentName: p.student.name,
        month: p.month,
        year: p.year,
        classFee: p.classFee,
        courierFee: p.courierFee,
        totalAmount: p.totalAmount,
        paymentStatus: p.paymentStatus,
        paymentDate: p.paymentDate ? p.paymentDate.toISOString().slice(0,10) : '',
        trackingId: p.trackingId || ''
      }))
      headers = ['invoiceNo', 'studentName', 'month', 'year', 'classFee', 'courierFee', 'totalAmount', 'paymentStatus', 'paymentDate', 'trackingId']
      filename = 'payments.csv'
    } else if (type === 'tutes') {
      data = await prisma.tute.findMany()
      headers = ['tuteId', 'name', 'month', 'year', 'batch']
      filename = 'tutes.csv'
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const csvRows = []
    csvRows.push(headers.join(','))
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header as keyof typeof row]
        if (val === null || val === undefined) return ''
        const strVal = String(val)
        if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
          return `"${strVal.replace(/"/g, '""')}"`
        }
        return strVal
      })
      csvRows.push(values.join(','))
    }

    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}