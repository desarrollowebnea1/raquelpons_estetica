// app/api/admin/before-after/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const data: any = {}
    if (body.title !== undefined) data.title = body.title
    if (body.serviceName !== undefined) data.serviceName = body.serviceName || null
    if (body.beforeImageUrl !== undefined) data.beforeImageUrl = body.beforeImageUrl || null
    if (body.afterImageUrl !== undefined) data.afterImageUrl = body.afterImageUrl || null
    if (body.description !== undefined) data.description = body.description || null
    if (body.active !== undefined) data.active = body.active
    if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder

    const item = await prisma.beforeAfter.update({ where: { id: params.id }, data })
    return NextResponse.json({ item })
  } catch {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    await prisma.beforeAfter.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
