'use client'
// components/public/ContactSection.tsx
import { motion } from 'framer-motion'
import { MapPin, Clock, Instagram, MessageCircle, ExternalLink } from 'lucide-react'
import type { BusinessSettings } from '@/types'

interface ContactProps {
  settings: Pick<
    BusinessSettings,
    | 'address'
    | 'whatsappNumber'
    | 'instagramUrl'
    | 'openingHours'
    | 'mapEmbedUrl'
    | 'googleMapsUrl'
    | 'brandName'
  >
  contentMap?: Record<string, string>
}

export default function ContactSection({ settings, contentMap = {} }: ContactProps) {
  const DEFAULT_EMBED = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108822.2!2d-64.1951375!3d-31.4132969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a289ef3815af%3A0x4a67cc31eedfe6b7!2sC%C3%B3rdoba%2C%20Argentina!5e0!3m2!1ses!2sar!4v1`
  const embed = settings.mapEmbedUrl || DEFAULT_EMBED

  return (
    <section id="contacto" className="section-padding bg-warmWhite">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-label mb-4">{contentMap['contact_section_label'] || 'Contacto & Ubicación'}</p>
          <h2 className="font-display text-4xl md:text-5xl text-anthracite mb-4">
            {contentMap['contact_title_line_1'] || 'Escribinos o'} <br />
            {contentMap['contact_title_line_2'] || 'reservá tu cita'}
          </h2>
          <div className="divider-soft" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="card-premium p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-nude flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-elegantBrown" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-sans text-xs font-medium tracking-wide uppercase text-anthracite/50 mb-1">
                    Ubicación
                  </p>
                  <p className="font-sans text-sm text-anthracite">{settings.address}</p>
                  {settings.googleMapsUrl && (
                    <a
                      href={settings.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-elegantBrown hover:underline mt-1"
                    >
                      Abrir en Google Maps <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-nude flex items-center justify-center flex-shrink-0">
                  <Clock size={16} className="text-elegantBrown" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-sans text-xs font-medium tracking-wide uppercase text-anthracite/50 mb-1">
                    Horarios
                  </p>
                  <p className="font-sans text-sm text-anthracite">{settings.openingHours}</p>
                </div>
              </div>
            </div>

            {/* Canales de contacto */}
            <div className="space-y-3">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Hola ${settings.brandName}, quiero hacer una consulta.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full justify-center text-sm"
              >
                <MessageCircle size={16} />
                WhatsApp Concierge
              </a>

              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full justify-center text-sm"
                >
                  <Instagram size={16} />
                  Seguir en Instagram
                </a>
              )}
            </div>

            <p className="font-sans text-[11px] text-anthracite/40 text-center">
              Atención con turno previo · Consultorio privado
            </p>
          </motion.div>

          {/* Mapa */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-soft overflow-hidden border border-[rgba(44,44,44,0.08)] shadow-soft h-[400px] lg:h-[480px]"
          >
            <iframe
              src={embed}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(100%) contrast(0.85) brightness(1.05)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación RAQUELPONS_ESTETICA"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
