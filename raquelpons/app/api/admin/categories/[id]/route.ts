// app/api/admin/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { type, ...data } = body
    const { id } = params

    // Try all three models — find which one has this ID
    const serviceType = body.type || 'service'

    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.slug !== undefined) updateData.slug = data.slug
    if (data.active !== undefined) updateData.active = data.active
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder

    // Try to update in each model
    let result: any = null
    try {
      result = await prisma.serviceCategory.update({ where: { id }, data: updateData })
    } catch { /* not a service category */ }

    if (!result) {
      try {
        result = await prisma.productCategory.update({ where: { id }, data: updateData })
      } catch { /* not a product category */ }
    }

    if (!result) {
      try {
        result = await prisma.skinConcern.update({ where: { id }, data: updateData })
      } catch { /* not found anywhere */ }
    }

    if (!result) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json({ category: result })
  } catch {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = params

  let deleted = false

  try {
    await prisma.serviceCategory.delete({ where: { id } })
    deleted = true
  } catch { /* not found or has relations */ }

  if (!deleted) {
    try {
      await prisma.productCategory.delete({ where: { id } })
      deleted = true
    } catch { }
  }

  if (!deleted) {
    try {
      await prisma.skinConcern.delete({ where: { id } })
      deleted = true
    } catch { }
  }

  if (!deleted) return NextResponse.json({ error: 'No se pudo eliminar. Puede tener elementos asociados.' }, { status: 409 })
  return NextResponse.json({ ok: true })
}
