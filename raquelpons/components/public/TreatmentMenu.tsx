'use client'
// components/public/TreatmentMenu.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Target, Sparkles, ChevronRight } from 'lucide-react'
import type { Service, ServiceCategory } from '@/types'
import { formatCurrencyARS } from '@/lib/utils'

interface TreatmentMenuProps {
  services: Service[]
  categories: ServiceCategory[]
  whatsapp: string
  brandName: string
  contentMap?: Record<string, string>
}

export default function TreatmentMenu({ services, categories, whatsapp, brandName, contentMap = {} }: TreatmentMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const activeCategories = categories.filter((c) => c.active)
  const filteredServices =
    activeCategory === 'all'
      ? services.filter((s) => s.active)
      : services.filter((s) => s.active && s.categoryId === activeCategory)

  const buildWAUrl = (serviceName: string) => {
    const msg = `Hola ${brandName}, quiero consultar sobre el tratamiento: ${serviceName}.\n\nMuchas gracias.`
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`
  }

  return (
    <section id="tratamientos" className="section-padding bg-warmWhite">
      <div className="container-premium">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-label mb-4">{contentMap['treatments_section_label'] || 'Tratamientos'}</p>
          <h2 className="font-display text-4xl md:text-5xl text-anthracite mb-4">
            {contentMap['treatments_title_line_1'] || 'The Treatment'} {contentMap['treatments_title_line_2'] || 'Menu'}
          </h2>
          <p className="font-sans text-base text-anthracite/60 max-w-lg mx-auto">
            {contentMap['treatments_description'] || 'Cada protocolo se selecciona a partir de una evaluación individual, priorizando seguridad y calidad.'}
          </p>
          <div className="divider-soft" />
        </motion.div>

        {/* Tabs de categorías */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-organic text-xs font-sans tracking-refined transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-anthracite text-warmWhite'
                : 'bg-nude/50 text-anthracite hover:bg-nude'
            }`}
          >
            Todos
          </button>
          {activeCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-organic text-xs font-sans tracking-refined transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-anthracite text-warmWhite'
                  : 'bg-nude/50 text-anthracite hover:bg-nude'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid servicios */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {filteredServices.map((service, i) => (
              <TreatmentCard
                key={service.id}
                service={service}
                index={i}
                buildWAUrl={buildWAUrl}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredServices.length === 0 && (
          <p className="text-center font-sans text-sm text-anthracite/40 py-16">
            No hay tratamientos en esta categoría.
          </p>
        )}

        {/* CTA diagnóstico */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center p-10 bg-parchment rounded-soft border border-[rgba(44,44,44,0.06)]"
        >
          <p className="section-label mb-4">¿No sabés por dónde empezar?</p>
          <h3 className="font-display text-3xl text-anthracite mb-4">
            Reserva de Diagnóstico Facial
          </h3>
          <p className="font-sans text-sm text-anthracite/60 mb-8 max-w-sm mx-auto">
            Una evaluación personalizada para determinar el protocolo más adecuado para tu piel.
          </p>
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hola ${brandName}, quiero solicitar una Reserva de Diagnóstico Facial.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm"
          >
            Solicitar diagnóstico
            <ChevronRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function TreatmentCard({
  service,
  index,
  buildWAUrl,
}: {
  service: Service
  index: number
  buildWAUrl: (name: string) => string
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="card-premium p-6 flex flex-col gap-4 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          {service.featured && (
            <span className="inline-flex items-center gap-1 text-[10px] font-sans tracking-wide uppercase text-elegantBrown bg-nude/60 px-2 py-0.5 rounded-full mb-2">
              <Sparkles size={8} /> Destacado
            </span>
          )}
          <h3 className="font-display text-lg text-anthracite leading-tight">{service.name}</h3>
        </div>
        <span className="text-xs font-sans font-medium text-champagne bg-champagne/10 px-3 py-1 rounded-full flex-shrink-0">
          {formatCurrencyARS(service.price)}
        </span>
      </div>

      {/* Descripción */}
      {service.shortDescription && (
        <p className="font-sans text-sm text-anthracite/60 leading-relaxed flex-1">
          {service.shortDescription}
        </p>
      )}

      {/* Metadatos */}
      <div className="flex flex-wrap gap-3">
        {service.objective && (
          <div className="flex items-center gap-1.5 text-[11px] font-sans text-anthracite/50">
            <Target size={11} className="text-champagne" />
            {service.objective}
          </div>
        )}
        {service.treatmentTime && (
          <div className="flex items-center gap-1.5 text-[11px] font-sans text-anthracite/50">
            <Clock size={11} className="text-champagne" />
            {service.treatmentTime}
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="flex gap-2 pt-2 border-t border-[rgba(44,44,44,0.06)]">
        <a
          href={buildWAUrl(service.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs flex-1 justify-center py-2.5"
        >
          Consultar
        </a>
      </div>
    </motion.article>
  )
}
