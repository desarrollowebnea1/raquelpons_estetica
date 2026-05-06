'use client'
// components/public/AppointmentForm.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, Calendar, MessageCircle } from 'lucide-react'
import type { Service } from '@/types'
import { buildWhatsAppUrl, buildAppointmentMessage } from '@/lib/whatsapp'

interface AppointmentFormProps {
  services: Service[]
  whatsapp: string
  brandName: string
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const TIMES = ['Mañana (9-12h)', 'Mediodía (12-15h)', 'Tarde (15-18h)', 'Tarde-noche (18-20h)']

export default function AppointmentForm({ services, whatsapp, brandName }: AppointmentFormProps) {
  const [form, setForm] = useState({
    customerName: '',
    whatsappNumber: '',
    serviceName: '',
    preferredDay: '',
    preferredTime: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.customerName.trim()) errs.customerName = 'El nombre es obligatorio'
    if (!form.whatsappNumber.trim()) errs.whatsappNumber = 'El WhatsApp es obligatorio'
    if (!form.serviceName.trim()) errs.serviceName = 'Seleccioná un servicio'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setSubmitting(true)

    const whatsappMessage = buildAppointmentMessage({
      brandName,
      customerName: form.customerName,
      whatsapp: form.whatsappNumber,
      serviceName: form.serviceName,
      preferredDay: form.preferredDay || null,
      preferredTime: form.preferredTime || null,
      message: form.message || null,
    })

    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName,
          whatsapp: form.whatsappNumber,
          serviceName: form.serviceName,
          preferredDay: form.preferredDay,
          preferredTime: form.preferredTime,
          message: form.message,
          whatsappMessage,
        }),
      })
    } catch {}

    window.open(buildWhatsAppUrl(whatsapp, whatsappMessage), '_blank')
    setSubmitted(true)
    setSubmitting(false)
  }

  const activeServices = services.filter((s) => s.active)

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12 }}
        >
          <CheckCircle size={56} className="text-sage mx-auto" />
        </motion.div>
        <h4 className="font-display text-2xl text-anthracite">¡Solicitud enviada!</h4>
        <p className="font-sans text-sm text-anthracite/60 max-w-sm">
          Tu solicitud de diagnóstico fue enviada por WhatsApp. Raquel se pondrá en contacto a la brevedad para confirmar tu turno.
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            setForm({ customerName: '', whatsappNumber: '', serviceName: '', preferredDay: '', preferredTime: '', message: '' })
          }}
          className="btn-secondary text-sm mt-2"
        >
          Nueva solicitud
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="appointment-name" className="label-premium">
            Nombre *
          </label>
          <input
            id="appointment-name"
            type="text"
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            placeholder="Tu nombre completo"
            className="input-premium"
            autoComplete="name"
          />
          {errors.customerName && (
            <p className="text-xs text-red-400 mt-1">{errors.customerName}</p>
          )}
        </div>

        <div>
          <label htmlFor="appointment-whatsapp" className="label-premium">
            WhatsApp *
          </label>
          <input
            id="appointment-whatsapp"
            type="tel"
            value={form.whatsappNumber}
            onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
            placeholder="Ej: 3794000000"
            className="input-premium"
            autoComplete="tel"
          />
          {errors.whatsappNumber && (
            <p className="text-xs text-red-400 mt-1">{errors.whatsappNumber}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="appointment-service" className="label-premium">
          Servicio de interés *
        </label>
        <select
          id="appointment-service"
          value={form.serviceName}
          onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
          className="input-premium bg-warmWhite"
        >
          <option value="">Seleccioná un servicio</option>
          {activeServices.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
          <option value="Consulta general">Consulta general / No lo sé aún</option>
        </select>
        {errors.serviceName && (
          <p className="text-xs text-red-400 mt-1">{errors.serviceName}</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="appointment-day" className="label-premium">
            Día preferido (opcional)
          </label>
          <select
            id="appointment-day"
            value={form.preferredDay}
            onChange={(e) => setForm({ ...form, preferredDay: e.target.value })}
            className="input-premium bg-warmWhite"
          >
            <option value="">Sin preferencia</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="appointment-time" className="label-premium">
            Horario preferido (opcional)
          </label>
          <select
            id="appointment-time"
            value={form.preferredTime}
            onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
            className="input-premium bg-warmWhite"
          >
            <option value="">Sin preferencia</option>
            {TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="appointment-message" className="label-premium">
          Mensaje (opcional)
        </label>
        <textarea
          id="appointment-message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Contanos sobre tu piel, inquietudes o consultas previas..."
          rows={4}
          className="input-premium resize-none"
          maxLength={500}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="btn-whatsapp flex-1 justify-center text-sm"
        >
          <MessageCircle size={16} />
          {submitting ? 'Enviando...' : 'Solicitar por WhatsApp'}
        </button>
        <div className="flex items-center gap-2 text-[11px] font-sans text-anthracite/40">
          <Calendar size={12} />
          <span>Confirmación en las próximas horas hábiles</span>
        </div>
      </div>

      <p className="font-sans text-[11px] text-anthracite/40 text-center">
        La información publicada no reemplaza una evaluación profesional personalizada.
        Los resultados pueden variar según cada persona.
      </p>
    </form>
  )
}
