// app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const type = req.nextUrl.searchParams.get('type') || 'service'

  try {
    if (type === 'service') {
      const categories = await prisma.serviceCategory.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] })
      return NextResponse.json({ categories })
    }
    if (type === 'product') {
      const categories = await prisma.productCategory.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] })
      return NextResponse.json({ categories })
    }
    if (type === 'skin') {
      const categories = await prisma.skinConcern.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] })
      return NextResponse.json({ categories })
    }
    return NextResponse.json({ categories: [] })
  } catch {
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { type, name, slug, active = true, sortOrder = 0 } = body

    if (!name?.trim()) return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })

    const cleanSlug = slug || name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')

    if (type === 'service') {
      const cat = await prisma.serviceCategory.create({ data: { name: name.trim(), slug: cleanSlug, active, sortOrder } })
      return NextResponse.json({ category: cat }, { status: 201 })
    }
    if (type === 'product') {
      const cat = await prisma.productCategory.create({ data: { name: name.trim(), slug: cleanSlug, active, sortOrder } })
      return NextResponse.json({ category: cat }, { status: 201 })
    }
    if (type === 'skin') {
      const cat = await prisma.skinConcern.create({ data: { name: name.trim(), slug: cleanSlug, active, sortOrder } })
      return NextResponse.json({ category: cat }, { status: 201 })
    }
    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
  } catch (e: any) {
    if (e?.code === 'P2002') return NextResponse.json({ error: 'El slug ya existe' }, { status: 409 })
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 })
  }
}
