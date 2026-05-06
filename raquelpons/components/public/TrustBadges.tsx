'use client'
// components/public/TrustBadges.tsx
import { motion } from 'framer-motion'
import { GraduationCap, Globe, Star, Microscope, Heart, Package } from 'lucide-react'

const badges = [
  {
    icon: GraduationCap,
    label: 'Lic. en Kinesiología y Fisioterapia',
    desc: 'Título universitario habilitante',
  },
  {
    icon: Globe,
    label: 'Formación profesional en España',
    desc: 'Capacitación internacional',
  },
  {
    icon: Star,
    label: 'Experiencia en estética avanzada',
    desc: 'Protocolos profesionales actualizados',
  },
  {
    icon: Microscope,
    label: 'Dermocosmética basada en evidencia',
    desc: 'Criterio clínico en cada tratamiento',
  },
  {
    icon: Heart,
    label: 'Atención personalizada',
    desc: 'Diagnóstico individual y seguimiento',
  },
  {
    icon: Package,
    label: 'Boutique curada de productos',
    desc: 'Selección con criterio profesional',
  },
]

export default function TrustBadges() {
  return (
    <section className="section-padding bg-warmWhite border-y border-[rgba(44,44,44,0.06)]">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-label mb-3">Por qué elegir RAQUELPONS_ESTETICA</p>
          <div className="divider-soft mx-auto" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, i) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="card-premium p-5 flex flex-col items-center text-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-nude flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-elegantBrown" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-sans text-xs font-medium text-anthracite leading-tight mb-1">
                    {badge.label}
                  </p>
                  <p className="font-sans text-[10px] text-anthracite/50 leading-relaxed">
                    {badge.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
