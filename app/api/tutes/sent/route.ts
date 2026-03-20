import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDistributionId, generateInvoiceNo } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { studentId, tuteIds, trackingId, month, year, batch, addClassFee } = await request.json()

    const distributionId = generateDistributionId()
    const sentDate = new Date()

    // 1. Create TuteSent record
    const tuteSent = await prisma.tuteSent.create({
      data: {
        distributionId,
        studentId,
        tuteIds,
        trackingId,
        sentDate,
        month,
        year,
        batch,
      }
    })

    // 2. Fetch student details and enrolled classes
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { enrolledClasses: true, batch: true }
    })

    // 3. Fetch settings (fees)
    const settings = await prisma.setting.findFirst()
    if (!settings) {
      throw new Error('Settings not found')
    }

    // 4. Calculate class fee based on enrolled classes
    let classFee = 0
    if (addClassFee && student?.enrolledClasses) {
      const enrolled = student.enrolledClasses as string[]
      const feeMap: Record<string, number> = {
        '2028 Theory': settings.fee2028Theory,
        '2028 Paper': settings.fee2028Paper,
        '2027 Theory': settings.fee2027Theory,
        '2027 Paper': settings.fee2027Paper,
      }
      for (const cls of enrolled) {
        classFee += feeMap[cls] || 0
      }
    }

    const courierFee = settings.courierFee
    const totalAmount = classFee + courierFee

    // 5. Create a new invoice
    const invoiceNo = generateInvoiceNo()
    await prisma.payment.create({
      data: {
        invoiceNo,
        studentId,
        month,
        year,
        classFee,
        courierFee,
        totalAmount,
        paymentStatus: 'Pending',
        trackingId,
      }
    })

    return NextResponse.json(tuteSent)
  } catch (error) {
    console.error('Error sending tutes:', error)
    return NextResponse.json({ error: 'Failed to send tutes' }, { status: 500 })
  }
}
