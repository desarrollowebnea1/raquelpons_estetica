// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { productSchema } from '@/lib/validations'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const products = await prisma.product.findMany({
    include: { category: true, skinConcern: true },
    orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }],
  })
  return NextResponse.json({ products })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const parsed = productSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  try {
    const product = await prisma.product.create({ data: parsed.data })
    return NextResponse.json(product, { status: 201 })
  } catch (e: any) {
    if (e.code === 'P2002') return NextResponse.json({ error: 'El slug ya existe' }, { status: 409 })
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
  }
}
