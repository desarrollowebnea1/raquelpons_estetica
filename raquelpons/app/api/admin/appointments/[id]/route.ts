// app/api/admin/appointments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const { status } = body

  const validStatuses = ['NEW', 'CONTACTED', 'CONFIRMED', 'CANCELLED', 'FINISHED']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }

  const updated = await prisma.appointmentRequest.update({
    where: { id: params.id },
    data: { status },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await prisma.appointmentRequest.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
