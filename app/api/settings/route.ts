import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let settings = await prisma.setting.findFirst()
    if (!settings) {
      // Create default settings
      settings = await prisma.setting.create({
        data: {
          fee2027Theory: 3800,
          fee2027Paper: 3800,
          fee2028Theory: 3800,
          fee2028Paper: 3800,
          courierFee: 300,
          bankDetails: 'Bank: Example Bank\nAccount: 123456789',
        }
      })
    }
    return NextResponse.json(settings)
  } catch (error) {
    console.error('GET settings error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json()
    const existing = await prisma.setting.findFirst()
    
    if (!existing) {
      // Create new if none exists
      const settings = await prisma.setting.create({
        data: {
          fee2027Theory: data.fee2027Theory,
          fee2027Paper: data.fee2027Paper,
          fee2028Theory: data.fee2028Theory,
          fee2028Paper: data.fee2028Paper,
          courierFee: data.courierFee,
          bankDetails: data.bankDetails,
        }
      })
      return NextResponse.json(settings)
    } else {
      const settings = await prisma.setting.update({
        where: { id: existing.id },
        data: {
          fee2027Theory: data.fee2027Theory,
          fee2027Paper: data.fee2027Paper,
          fee2028Theory: data.fee2028Theory,
          fee2028Paper: data.fee2028Paper,
          courierFee: data.courierFee,
          bankDetails: data.bankDetails,
        }
      })
      return NextResponse.json(settings)
    }
  } catch (error) {
    console.error('PATCH settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}