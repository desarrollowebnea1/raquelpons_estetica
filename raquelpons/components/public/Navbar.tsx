'use client'
// components/public/Navbar.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Tratamientos', href: '/#tratamientos' },
  { label: 'Boutique', href: '/#boutique' },
  { label: 'Formación', href: '/#formacion' },
  { label: 'Diagnóstico', href: '/#diagnostico' },
  { label: 'Contacto', href: '/#contacto' },
]

interface NavbarProps {
  whatsapp?: string
}

export default function Navbar({ whatsapp = '5493790000000' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault()
      const id = href.replace('/#', '')
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setMobileOpen(false)
      }
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-parchment/80 backdrop-blur-[12px] border-b border-[rgba(44,44,44,0.08)] shadow-soft'
            : 'bg-transparent'
        }`}
      >
        <div className="container-premium">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex flex-col leading-none">
              <span className="font-display text-base md:text-lg font-medium text-anthracite tracking-wide">
                RAQUELPONS
              </span>
              <span className="text-[10px] font-sans tracking-ultraspaced text-elegantBrown uppercase">
                ESTÉTICA
              </span>
            </Link>

            {/* Nav Desktop */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="text-xs font-sans tracking-refined text-anthracite/70 hover:text-anthracite transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hola, quiero solicitar una Reserva de Diagnóstico Facial.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-champagne text-xs px-5 py-2.5"
              >
                Reserva de Diagnóstico
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-anthracite"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-x-0 top-16 z-40 bg-parchment/95 backdrop-blur-[12px] border-b border-[rgba(44,44,44,0.08)] lg:hidden"
          >
            <div className="container-premium py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="text-sm font-sans tracking-refined text-anthracite/80 hover:text-anthracite transition-colors py-1 border-b border-[rgba(44,44,44,0.06)]"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hola, quiero solicitar una Reserva de Diagnóstico Facial.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-champagne text-sm mt-2 w-full justify-center"
              >
                Reserva de Diagnóstico
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
