// app/api/admin/inquiries/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { status } = await request.json()
  const validStatuses = ['NEW', 'CONTACTED', 'PAYMENT_PENDING', 'DELIVERED', 'CANCELLED']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }

  const updated = await prisma.productInquiry.update({ where: { id: params.id }, data: { status } })
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await prisma.productInquiry.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
