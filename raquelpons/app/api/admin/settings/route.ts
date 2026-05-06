// app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { settingsSchema } from '@/lib/validations'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const settings = await prisma.businessSettings.findFirst()
  return NextResponse.json({ settings })
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const parsed = settingsSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  try {
    const existing = await prisma.businessSettings.findFirst()
    let settings
    if (existing) {
      settings = await prisma.businessSettings.update({
        where: { id: existing.id },
        data: parsed.data,
      })
    } else {
      settings = await prisma.businessSettings.create({ data: parsed.data })
    }
    return NextResponse.json({ settings })
  } catch {
    return NextResponse.json({ error: 'Error al guardar configuración' }, { status: 500 })
  }
}
