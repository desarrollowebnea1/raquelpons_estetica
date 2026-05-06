'use client'
// components/public/AboutProfessional.tsx
import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

interface AboutProps {
  settings: {
    aboutText: string
    trainingText: string
    experienceText: string
    brandName: string
  }
  contentMap?: Record<string, string>
}

export default function AboutProfessional({ settings, contentMap = {} }: AboutProps) {
  return (
    <section id="formacion" className="section-padding bg-parchment">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-label mb-6">{contentMap['about_section_label'] || 'La profesional'}</p>
            <h2 className="font-display text-4xl md:text-5xl text-anthracite mb-6 leading-tight">
              {contentMap['about_title_line_1'] || 'Un enfoque integral'}
              <br />
              <em className="text-elegantBrown">{contentMap['about_title_line_2'] || 'del cuidado de la piel'}</em>
            </h2>
            <div className="w-16 h-px bg-champagne mb-8" />
            <p className="font-sans text-base text-anthracite/70 leading-relaxed mb-8">
              {settings.aboutText}
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 items-start p-4 bg-warmWhite rounded-soft border border-[rgba(44,44,44,0.06)]">
                <Award size={18} className="text-champagne flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="font-sans text-xs font-medium text-anthracite mb-1">Formación</p>
                  <p className="font-sans text-sm text-anthracite/65">{settings.trainingText}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-warmWhite rounded-soft border border-[rgba(44,44,44,0.06)]">
                <Award size={18} className="text-champagne flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="font-sans text-xs font-medium text-anthracite mb-1">Experiencia</p>
                  <p className="font-sans text-sm text-anthracite/65">{settings.experienceText}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Visual card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            {/* Imagen placeholder premium */}
            <div className="aspect-[3/4] max-w-sm mx-auto lg:mx-0 lg:ml-auto rounded-soft bg-gradient-to-br from-nude via-champagne/30 to-dustyRose/40 flex items-end overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center text-center p-8 opacity-30">
                <div className="space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-full border border-champagne" />
                  <p className="font-display italic text-2xl text-elegantBrown">
                    {settings.brandName.split('_')[0]}
                  </p>
                </div>
              </div>
              <div className="relative z-10 p-6 bg-gradient-to-t from-anthracite/80 to-transparent w-full">
                <p className="font-sans text-xs text-warmWhite/80 tracking-wide mb-1">
                  {contentMap['about_card_location'] || 'Córdoba, Argentina'}
                </p>
                <p className="font-display text-lg text-warmWhite">
                  {contentMap['about_card_title'] || 'Estética Profesional & Cosmeatria'}
                </p>
                <p className="font-sans text-xs text-champagne mt-2 tracking-wide">
                  {contentMap['about_card_subtitle'] || 'Formación Internacional · España'}
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}
