// app/api/admin/before-after/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const items = await prisma.beforeAfter.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] })
    return NextResponse.json({ items })
  } catch {
    return NextResponse.json({ error: 'Error al obtener casos' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { title, serviceName, beforeImageUrl, afterImageUrl, description, active = true, sortOrder = 0 } = body

    if (!title?.trim()) return NextResponse.json({ error: 'El título es obligatorio' }, { status: 400 })

    const item = await prisma.beforeAfter.create({
      data: {
        title: title.trim(),
        serviceName: serviceName?.trim() || null,
        beforeImageUrl: beforeImageUrl?.trim() || null,
        afterImageUrl: afterImageUrl?.trim() || null,
        description: description?.trim() || null,
        active,
        sortOrder,
      }
    })
    return NextResponse.json({ item }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear caso' }, { status: 500 })
  }
}
