'use client'
// components/public/TestimonialsSection.tsx
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import type { Testimonial } from '@/types'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export default function TestimonialsSection({ testimonials }: TestimonialsProps) {
  const active = testimonials.filter((t) => t.active).sort((a, b) => a.sortOrder - b.sortOrder)
  if (active.length === 0) return null

  return (
    <section className="section-padding bg-nude/30">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-label mb-4">Testimonios</p>
          <h2 className="font-display text-4xl md:text-5xl text-anthracite mb-4">
            Lo que dicen nuestras clientas
          </h2>
          <div className="divider-soft" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-premium p-7 flex flex-col gap-5"
            >
              <Quote size={24} className="text-champagne/60" strokeWidth={1} />
              <p className="font-display italic text-base text-anthracite/80 leading-relaxed flex-1">
                "{t.text}"
              </p>
              <div className="border-t border-[rgba(44,44,44,0.06)] pt-4">
                <p className="font-sans text-sm font-medium text-anthracite">{t.customerName}</p>
                {t.serviceName && (
                  <p className="font-sans text-xs text-elegantBrown mt-0.5">{t.serviceName}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
