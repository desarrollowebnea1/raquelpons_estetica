// app/api/admin/appointments/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const appointments = await prisma.appointmentRequest.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(appointments)
}
