import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const studentId = params.studentId
    const sentTutes = await prisma.tuteSent.findMany({
      where: { studentId }
    })
    const sentTuteIds = sentTutes.flatMap(s => s.tuteIds)
    return NextResponse.json({ sentTuteIds })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sent tutes' }, { status: 500 })
  }
}