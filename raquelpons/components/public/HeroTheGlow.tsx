'use client'
// components/public/HeroTheGlow.tsx
import { motion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/utils'

interface HeroProps {
  settings: {
    heroTitle: string
    heroItalicWord: string
    heroDescription: string
    heroImageUrl?: string | null
    heroVideoUrl?: string | null
    whatsappNumber: string
    address: string
    brandName: string
  }
}

export default function HeroTheGlow({ settings }: HeroProps) {
  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-parchment">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-nude/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-champagne/10 to-transparent" />
        {/* Círculo decorativo */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full border border-champagne/20 opacity-50" />
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full border border-nude/30 opacity-40" />
        
        <div className="absolute inset-y-0 right-0 w-1/2 lg:w-5/12">
          <img
            src={settings.heroImageUrl || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80'}
            alt="Mujer con rostro de piel luminosa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-parchment via-parchment/20 to-transparent" />
        </div>
      </div>

      <div className="container-premium relative z-10 pt-24 pb-16 lg:pt-32">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-2xl"
        >
          {/* Badge ubicación */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 mb-8"
          >
            <MapPin size={12} className="text-elegantBrown" />
            <span className="text-xs font-sans tracking-ultraspaced text-elegantBrown uppercase">
              {settings.address}
            </span>
          </motion.div>

          {/* Título principal */}
          <motion.h1
            variants={fadeInUp}
            className="font-display text-3xl md:text-4xl lg:text-5xl text-anthracite leading-tight mb-6"
          >
            {settings.heroTitle}
          </motion.h1>

          {/* Línea decorativa */}
          <motion.div
            variants={fadeInUp}
            className="w-20 h-px bg-champagne mb-6"
          />

          {/* Descripción */}
          <motion.p
            variants={fadeInUp}
            className="font-sans text-base md:text-lg text-anthracite/65 leading-relaxed mb-10 max-w-lg"
          >
            {settings.heroDescription}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hola, quiero solicitar una Reserva de Diagnóstico Facial.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary group text-sm"
            >
              Reserva de Diagnóstico Facial
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </a>

            <button
              onClick={() => handleScrollTo('tratamientos')}
              className="btn-secondary text-sm"
            >
              Explorar Tratamientos
            </button>
          </motion.div>

          {/* Trust micro */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 flex items-center gap-6 text-[11px] font-sans tracking-wide text-anthracite/50"
          >
            <span>Lic. Kinesiología y Fisioterapia</span>
            <span className="w-1 h-1 rounded-full bg-champagne" />
            <span>Formación en España</span>
            <span className="w-1 h-1 rounded-full bg-champagne" />
            <span>Atención con turno previo</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-sans tracking-ultraspaced text-anthracite/30 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-champagne/40 to-transparent"
        />
      </motion.div>
    </section>
  )
}
