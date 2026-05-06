// app/api/product-inquiries/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productInquirySchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = productInquirySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const inquiry = await prisma.productInquiry.create({
      data: {
        customerName: parsed.data.customerName,
        whatsapp: parsed.data.whatsapp,
        message: parsed.data.message,
        subtotal: parsed.data.subtotal,
        whatsappMessage: body.whatsappMessage || null,
        status: 'NEW',
        items: {
          create: parsed.data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
    })

    return NextResponse.json({ success: true, id: inquiry.id })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await import('@/lib/auth').then((m) => m.getSession())
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const inquiries = await prisma.productInquiry.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(inquiries)
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
