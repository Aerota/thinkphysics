import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDistributionId, generateInvoiceNo } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { studentId, tuteIds, trackingId, month, year, batch } = await request.json()

    const distributionId = generateDistributionId()
    const sentDate = new Date()

    // Create TuteSent record
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

    // Get student to determine class fee
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    })
    const classFee = student?.batch === '2028 AL' ? 3800 : 3800 // adjust if different
    const courierFee = 300
    const totalAmount = classFee + courierFee

    // Check if an invoice already exists for this student, month, year
    const existingInvoice = await prisma.payment.findFirst({
      where: {
        studentId,
        month,
        year,
      }
    })

    if (existingInvoice) {
      // Update existing invoice with new tracking ID
      await prisma.payment.update({
        where: { id: existingInvoice.id },
        data: { trackingId }
      })
    } else {
      // Create new invoice
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
    }

    return NextResponse.json(tuteSent)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to send tutes' }, { status: 500 })
  }
}