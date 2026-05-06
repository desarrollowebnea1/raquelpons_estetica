// app/api/admin/testimonials/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { testimonialSchema } from '@/lib/validations'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const testimonials = await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(testimonials)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const parsed = testimonialSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const t = await prisma.testimonial.create({ data: parsed.data })
  return NextResponse.json(t, { status: 201 })
}
