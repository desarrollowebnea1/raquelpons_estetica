import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const items = await prisma.siteContent.findMany({
    orderBy: [{ section: 'asc' }, { sortOrder: 'asc' }],
  })

  return NextResponse.json({ items })
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const items = body.items || []

  for (const item of items) {
    await prisma.siteContent.update({
      where: { id: item.id },
      data: { value: item.value },
    })
  }

  return NextResponse.json({ success: true })
}
