// app/api/admin/services/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { serviceSchema } from '@/lib/validations'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const services = await prisma.service.findMany({
    include: { category: true },
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json({ services })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  if (body.imageUrl === '') body.imageUrl = null
  if (body.categoryId === '') delete body.categoryId
  const parsed = serviceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const service = await prisma.service.create({ data: parsed.data })
    return NextResponse.json(service, { status: 201 })
  } catch (e: any) {
    if (e.code === 'P2002') return NextResponse.json({ error: 'El slug ya existe' }, { status: 409 })
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 })
  }
}
