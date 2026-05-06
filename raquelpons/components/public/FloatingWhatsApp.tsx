'use client'

import { MessageCircle } from 'lucide-react'

interface FloatingWhatsAppProps {
  whatsappNumber: string
}

export default function FloatingWhatsApp({ whatsappNumber }: FloatingWhatsAppProps) {
  const number = whatsappNumber || '5493790000000'
  const message = encodeURIComponent('Hola RAQUELPONS_ESTETICA, quiero hacer una consulta.')
  const url = `https://wa.me/${number}?text=${message}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp RAQUELPONS_ESTETICA"
      className="fixed right-5 bottom-5 z-[9999] flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <MessageCircle size={22} />
    </a>
  )
}