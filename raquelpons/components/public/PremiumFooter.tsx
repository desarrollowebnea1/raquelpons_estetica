// components/public/PremiumFooter.tsx
import Link from 'next/link'
import { Instagram, MessageCircle } from 'lucide-react'
import type { BusinessSettings } from '@/types'

interface FooterProps {
  settings: Pick<BusinessSettings, 'brandName' | 'instagramUrl' | 'whatsappNumber' | 'address' | 'legalText'>
  contentMap?: Record<string, string>
}

export default function PremiumFooter({ settings, contentMap = {} }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-anthracite text-warmWhite/70">
      {/* Main footer */}
      <div className="container-premium py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <p className="font-display text-base font-medium text-warmWhite tracking-wide">
                RAQUELPONS
              </p>
              <p className="text-[10px] font-sans tracking-ultraspaced text-champagne uppercase">
                ESTÉTICA
              </p>
            </div>
            <p className="font-sans text-xs leading-relaxed mb-5">
              Dermocosmética profesional y estética integral en Córdoba, Argentina.
            </p>
            <div className="flex gap-3">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-warmWhite/20 flex items-center justify-center hover:border-champagne hover:text-champagne transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={14} />
                </a>
              )}
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-warmWhite/20 flex items-center justify-center hover:border-champagne hover:text-champagne transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle size={14} />
              </a>
            </div>
          </div>

          {/* Tratamientos */}
          <div>
            <p className="font-sans text-[11px] tracking-ultraspaced uppercase text-warmWhite/40 mb-4">
              Tratamientos
            </p>
            <ul className="space-y-2">
              {['Faciales', 'Corporales', 'Aparatología', 'Cejas y mirada', 'Bienestar'].map((item) => (
                <li key={item}>
                  <a
                    href="/#tratamientos"
                    className="font-sans text-xs hover:text-champagne transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Boutique */}
          <div>
            <p className="font-sans text-[11px] tracking-ultraspaced uppercase text-warmWhite/40 mb-4">
              Boutique
            </p>
            <ul className="space-y-2">
              {['Suplementos', 'Cosmeceúticos', 'Cuidado facial', 'Protectores solares', 'Kits de cuidado'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="/#boutique"
                      className="font-sans text-xs hover:text-champagne transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <p className="font-sans text-[11px] tracking-ultraspaced uppercase text-warmWhite/40 mb-4">
              Contacto
            </p>
            <ul className="space-y-2">
              <li className="font-sans text-xs">{settings.address}</li>
              <li>
                <a
                  href="/#diagnostico"
                  className="font-sans text-xs hover:text-champagne transition-colors duration-300"
                >
                  Reserva de Diagnóstico
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs hover:text-champagne transition-colors duration-300"
                >
                  WhatsApp Concierge
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-warmWhite/10">
        <div className="container-premium py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[11px] text-warmWhite/30 text-center md:text-left">
            © {year} RAQUELPONS_ESTETICA · Todos los derechos reservados
          </p>
          <p className="font-sans text-[11px] text-warmWhite/30 text-center max-w-md">
            {contentMap['footer_legal_text'] || settings.legalText}
          </p>
        </div>
      </div>
    </footer>
  )
}
