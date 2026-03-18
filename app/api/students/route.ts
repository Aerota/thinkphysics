import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateStudentId } from '@/lib/utils'

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(students)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    // Validate required fields including username
    if (!data.username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }
    const studentId = generateStudentId()
    const student = await prisma.student.create({
      data: {
        studentId,
        username: data.username,
        name: data.name,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || '',
        city: data.city,
        batch: data.batch,
        contactNo: data.contactNo,
        email: data.email || '',
      }
    })
    return NextResponse.json(student)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }
    await prisma.student.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 })
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
    const student = await prisma.student.update({
      where: { id },
      data: {
        username: data.username,
        name: data.name,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        batch: data.batch,
        contactNo: data.contactNo,
        email: data.email,
      }
    })
    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
  }
}