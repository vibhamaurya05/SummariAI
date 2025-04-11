import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, email, full_name = '', customer_id = null, price_id = null, status = 'ACTIVE' } = body

    if (!id || !email) {
      return NextResponse.json({ error: 'id and email are required' }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        id,
        email,
        full_name,
        customer_id,
        price_id,
        status,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
