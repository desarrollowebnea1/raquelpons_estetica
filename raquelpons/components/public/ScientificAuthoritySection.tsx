'use client'
// components/public/ScientificAuthoritySection.tsx
import { motion } from 'framer-motion'
import { Shield, CheckCircle } from 'lucide-react'

interface ScientificProps {
  settings: {
    trainingText: string
    experienceText: string
    aboutText: string
  }
}

const pillars = [
  'Evaluación profesional individualizada',
  'Selección de activos de calidad certificada',
  'Protocolos actualizados con evidencia',
  'Seguimiento personalizado del proceso',
  'Información transparente sin promesas exageradas',
  'Coherencia entre necesidad, piel y objetivo',
]

export default function ScientificAuthoritySection({ settings }: ScientificProps) {
  return (
    <section id="formacion" className="section-padding bg-parchment">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            <div className="p-8 bg-warmWhite rounded-soft border border-[rgba(44,44,44,0.06)] space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-nude flex items-center justify-center">
                  <Shield size={18} className="text-elegantBrown" strokeWidth={1.5} />
                </div>
                <p className="font-sans text-xs font-medium tracking-wide uppercase text-anthracite">
                  Filosofía de trabajo
                </p>
              </div>
              <blockquote className="font-display italic text-xl md:text-2xl text-anthracite leading-relaxed">
                "Cada protocolo se selecciona a partir de una evaluación individual, priorizando la seguridad,
                la calidad de los activos utilizados y la coherencia entre necesidad, piel y objetivo estético."
              </blockquote>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {pillars.map((p, i) => (
                <motion.div
                  key={p}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex items-start gap-2 text-xs font-sans text-anthracite/70"
                >
                  <CheckCircle size={13} className="text-sage flex-shrink-0 mt-0.5" />
                  {p}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="section-label mb-6">Autoridad profesional</p>
            <h2 className="font-display text-4xl md:text-5xl text-anthracite mb-6 leading-tight">
              Ciencia, criterio
              <br />
              <em className="text-elegantBrown">y cuidado personalizado</em>
            </h2>
            <div className="w-16 h-px bg-champagne mb-8" />

            <div className="space-y-6">
              <div>
                <p className="font-sans text-xs font-medium tracking-wide uppercase text-anthracite/40 mb-2">
                  Formación
                </p>
                <p className="font-sans text-sm text-anthracite/70 leading-relaxed">
                  {settings.trainingText}
                </p>
              </div>
              <div>
                <p className="font-sans text-xs font-medium tracking-wide uppercase text-anthracite/40 mb-2">
                  Experiencia profesional
                </p>
                <p className="font-sans text-sm text-anthracite/70 leading-relaxed">
                  {settings.experienceText}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
