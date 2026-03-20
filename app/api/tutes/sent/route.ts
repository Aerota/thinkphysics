import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDistributionId, generateInvoiceNo } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { studentId, tuteIds, trackingId, month, year, batch } = await request.json()

    const distributionId = generateDistributionId()
    const sentDate = new Date()

    // 1. Create the TuteSent record
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

    // 2. Get student details (to know the batch and thus the fee)
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    })

    // Determine class fee based on student's batch (you can also fetch from settings table later)
    const classFee = student?.batch === '2028 AL' ? 3800 : 3800
    const courierFee = 300
    const totalAmount = classFee + courierFee

    // 3. Always create a new invoice (do NOT check for existing)
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
    console.error(error)
    return NextResponse.json({ error: 'Failed to send tutes' }, { status: 500 })
  }
}
