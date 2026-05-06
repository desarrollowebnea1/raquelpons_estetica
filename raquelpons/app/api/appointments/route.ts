// app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { appointmentSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = appointmentSchema.safeParse({
      customerName: body.customerName,
      whatsapp: body.whatsapp,
      serviceName: body.serviceName,
      preferredDay: body.preferredDay,
      preferredTime: body.preferredTime,
      message: body.message,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointmentRequest.create({
      data: {
        customerName: parsed.data.customerName,
        whatsapp: parsed.data.whatsapp,
        serviceName: parsed.data.serviceName,
        preferredDay: parsed.data.preferredDay,
        preferredTime: parsed.data.preferredTime,
        message: parsed.data.message,
        whatsappMessage: body.whatsappMessage || null,
        status: 'NEW',
      },
    })

    return NextResponse.json({ success: true, id: appointment.id })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await import('@/lib/auth').then((m) => m.getSession())
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const appointments = await prisma.appointmentRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(appointments)
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
