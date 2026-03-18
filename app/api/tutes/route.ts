import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tutes = await prisma.tute.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(tutes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tutes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    // Generate a simple tuteId (you can improve)
    const count = await prisma.tute.count()
    const tuteId = `T${(count + 1).toString().padStart(3, '0')}`
    const tute = await prisma.tute.create({
      data: {
        tuteId,
        name: data.name,
        month: data.month,
        year: data.year,
        batch: data.batch,
      }
    })
    return NextResponse.json(tute)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create tute' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }
    const data = await request.json()
    const tute = await prisma.tute.update({
      where: { id },
      data: {
        name: data.name,
        month: data.month,
        year: data.year,
        batch: data.batch,
      }
    })
    return NextResponse.json(tute)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tute' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }
    await prisma.tute.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tute' }, { status: 500 })
  }
}