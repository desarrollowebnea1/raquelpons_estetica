// lib/whatsapp.ts

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

export function buildAppointmentMessage(data: {
  brandName: string
  customerName: string
  whatsapp: string
  serviceName: string
  preferredDay?: string | null
  preferredTime?: string | null
  message?: string | null
}): string {
  const lines = [
    `Hola ${data.brandName}, quiero solicitar una reserva de diagnóstico:`,
    ``,
    `Nombre: ${data.customerName}`,
    `WhatsApp: ${data.whatsapp}`,
    `Servicio de interés: ${data.serviceName}`,
  ]
  if (data.preferredDay) lines.push(`Día preferido: ${data.preferredDay}`)
  if (data.preferredTime) lines.push(`Horario preferido: ${data.preferredTime}`)
  if (data.message) {
    lines.push(``)
    lines.push(`Mensaje:`)
    lines.push(data.message)
  }
  lines.push(``)
  lines.push(`Muchas gracias.`)
  return lines.join('\n')
}

export function buildProductInquiryMessage(data: {
  brandName: string
  customerName: string
  whatsapp: string
  items: Array<{ name: string; quantity: number; price: number | null }>
  subtotal: number
  message?: string | null
}): string {
  const lines = [
    `Hola ${data.brandName}, quiero consultar por estos productos:`,
    ``,
    `CLIENTE:`,
    `Nombre: ${data.customerName}`,
    `WhatsApp: ${data.whatsapp}`,
    ``,
    `PRODUCTOS:`,
  ]

  for (const item of data.items) {
    const priceStr = item.price && item.price > 0 ? ` — ${formatCurrencyARS(item.price * item.quantity)}` : ''
    lines.push(`${item.quantity} x ${item.name}${priceStr}`)
  }

  if (data.message) {
    lines.push(``)
    lines.push(`ACLARACIÓN:`)
    lines.push(data.message)
  }

  const subtotalStr =
    data.subtotal > 0
      ? `\nTOTAL ESTIMADO:\n${formatCurrencyARS(data.subtotal)}`
      : '\nTOTAL ESTIMADO:\nA consultar'

  lines.push(subtotalStr)
  lines.push(``)
  lines.push(`Muchas gracias.`)
  return lines.join('\n')
}

export function buildProductSingleMessage(data: {
  brandName: string
  productName: string
}): string {
  return `Hola ${data.brandName}, quiero consultar por el producto: ${data.productName}.\n\nMuchas gracias.`
}

function formatCurrencyARS(amount: number): string {
  return `$${amount.toLocaleString('es-AR')}`
}
