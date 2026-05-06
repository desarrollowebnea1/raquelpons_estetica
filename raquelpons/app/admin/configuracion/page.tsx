'use client'
// app/admin/configuracion/page.tsx
import { useState, useEffect } from 'react'
import { Save, CheckCircle } from 'lucide-react'
import ImageUploadField from '@/components/admin/ImageUploadField'

interface Settings {
  id?: string
  brandName: string
  slogan: string
  heroTitle: string
  heroItalicWord: string
  heroDescription: string
  logoUrl: string
  heroImageUrl: string
  heroVideoUrl: string
  whatsappNumber: string
  instagramUrl: string
  facebookUrl: string
  address: string
  googleMapsUrl: string
  mapEmbedUrl: string
  openingHours: string
  aboutText: string
  trainingText: string
  experienceText: string
  legalText: string
  showBeforeAfter: boolean
  showTestimonials: boolean
  enableProducts: boolean
  enableAppointments: boolean
}

const TABS = [
  { id: 'brand', label: 'Marca y hero' },
  { id: 'contact', label: 'Contacto y ubicación' },
  { id: 'texts', label: 'Textos profesionales' },
  { id: 'sections', label: 'Secciones activas' },
]

export default function AdminConfiguracionPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('brand')

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        setSettings(d.settings || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const update = (key: keyof Settings, val: string | boolean) => {
    setSettings(prev => prev ? { ...prev, [key]: val } : prev)
  }

  const handleSave = async () => {
    if (!settings) return
    setSaving(true); setError(''); setSaved(false)
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    if (!res.ok) { const d = await res.json(); setError(typeof d.error === 'string' ? d.error : 'Error de validación. Revisá los campos obligatorios.'); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
      <p className="font-sans text-sm text-anthracite/40">Cargando configuración...</p>
    </div>
  )

  if (!settings) return (
    <div className="p-8 text-center">
      <p className="font-sans text-sm text-red-500">No se pudo cargar la configuración. Revisá la conexión a la base de datos.</p>
    </div>
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-anthracite mb-1">Configuración</h1>
          <p className="font-sans text-sm text-anthracite/50">Editá los textos, datos de contacto y secciones del sitio</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saved ? <><CheckCircle size={16} />Guardado</> : saving ? 'Guardando...' : <><Save size={16} />Guardar cambios</>}
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm font-sans text-red-600">{error}</div>}
      {saved && <div className="mb-4 p-3 bg-sage/20 border border-sage/30 rounded-lg text-sm font-sans text-sage">✓ Configuración guardada correctamente.</div>}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-nude/40 rounded-soft p-1 w-fit flex-wrap">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`font-sans text-sm px-4 py-2 rounded-soft transition-all ${tab === t.id ? 'bg-warmWhite text-anthracite shadow-sm' : 'text-anthracite/50 hover:text-anthracite'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card-premium p-6 space-y-6">
        {/* MARCA Y HERO */}
        {tab === 'brand' && (
          <>
            <Section title="Identidad de marca">
              <Field label="Nombre de marca" value={settings.brandName} onChange={v => update('brandName', v)} />
              <Field label="Eslogan" value={settings.slogan} onChange={v => update('slogan', v)} />
              <ImageUploadField
                label="Logo de marca"
                value={settings.logoUrl}
                onChange={v => update('logoUrl', v)}
                folder="logos"
                helperText="Recomendado: PNG o WEBP con fondo transparente, hasta 5MB"
              />
            </Section>
            <Section title="Hero principal">
              <Field label="Título del hero" value={settings.heroTitle} onChange={v => update('heroTitle', v)} />
              <Field label="Palabra italic destacada (The Glow)" value={settings.heroItalicWord} onChange={v => update('heroItalicWord', v)} />
              <FieldArea label="Descripción del hero" value={settings.heroDescription} onChange={v => update('heroDescription', v)} />
              <ImageUploadField
                label="Imagen de fondo (hero)"
                value={settings.heroImageUrl}
                onChange={v => update('heroImageUrl', v)}
                folder="hero"
                helperText="Recomendado: JPG de alta calidad, hasta 5MB"
              />
              <Field label="URL video de fondo (opcional)" value={settings.heroVideoUrl} onChange={v => update('heroVideoUrl', v)} placeholder="https://... (.mp4)" />
            </Section>
          </>
        )}

        {/* CONTACTO Y UBICACIÓN */}
        {tab === 'contact' && (
          <>
            <Section title="WhatsApp y redes">
              <div>
                <Field label="Número WhatsApp (sin + ni espacios, ej: 5493512345678)" value={settings.whatsappNumber} onChange={v => update('whatsappNumber', v)} placeholder="5493512345678" />
                <p className="font-sans text-xs text-anthracite/40 mt-1">Formato internacional. Para Argentina: 549 + código de área + número</p>
              </div>
              <Field label="Instagram URL" value={settings.instagramUrl} onChange={v => update('instagramUrl', v)} placeholder="https://instagram.com/..." />
              <Field label="Facebook URL (opcional)" value={settings.facebookUrl} onChange={v => update('facebookUrl', v)} placeholder="https://facebook.com/..." />
            </Section>
            <Section title="Dirección y mapa">
              <Field label="Dirección del consultorio" value={settings.address} onChange={v => update('address', v)} />
              <Field label="Horarios de atención" value={settings.openingHours} onChange={v => update('openingHours', v)} placeholder="Atención con turno previo" />
              <Field label="URL Google Maps (para botón 'Abrir mapa')" value={settings.googleMapsUrl} onChange={v => update('googleMapsUrl', v)} placeholder="https://maps.google.com/..." />
              <div>
                <label className="label-premium">Código embed de Google Maps</label>
                <textarea
                  className="input-premium resize-none font-mono text-xs"
                  rows={4}
                  value={settings.mapEmbedUrl}
                  onChange={e => update('mapEmbedUrl', e.target.value)}
                  placeholder='<iframe src="https://www.google.com/maps/embed?..." ...'
                />
                <p className="font-sans text-xs text-anthracite/40 mt-1">Copiá el código iframe completo desde Google Maps → Compartir → Insertar mapa</p>
              </div>
            </Section>
          </>
        )}

        {/* TEXTOS */}
        {tab === 'texts' && (
          <>
            <Section title="Sobre la profesional">
              <FieldArea label="Texto sobre RAQUELPONS_ESTETICA" value={settings.aboutText} onChange={v => update('aboutText', v)} rows={5} />
            </Section>
            <Section title="Formación y experiencia">
              <FieldArea label="Formación profesional" value={settings.trainingText} onChange={v => update('trainingText', v)} rows={3} />
              <FieldArea label="Experiencia" value={settings.experienceText} onChange={v => update('experienceText', v)} rows={3} />
            </Section>
            <Section title="Texto legal">
              <FieldArea label="Disclaimer / texto legal del pie de página" value={settings.legalText} onChange={v => update('legalText', v)} rows={2} />
            </Section>
          </>
        )}

        {/* SECCIONES */}
        {tab === 'sections' && (
          <Section title="Activar / desactivar secciones del sitio">
            <div className="space-y-4">
              <Toggle label="Mostrar sección Antes y Después" value={settings.showBeforeAfter} onChange={v => update('showBeforeAfter', v)} />
              <Toggle label="Mostrar sección Testimonios" value={settings.showTestimonials} onChange={v => update('showTestimonials', v)} />
              <Toggle label="Habilitar Boutique de Productos" value={settings.enableProducts} onChange={v => update('enableProducts', v)} />
              <Toggle label="Habilitar Reservas de Diagnóstico" value={settings.enableAppointments} onChange={v => update('enableAppointments', v)} />
            </div>
          </Section>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saved ? <><CheckCircle size={16} />Guardado</> : saving ? 'Guardando...' : <><Save size={16} />Guardar cambios</>}
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-base text-anthracite mb-4 pb-2 border-b border-[rgba(44,44,44,0.08)]">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="label-premium">{label}</label>
      <input className="input-premium" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

function FieldArea({ label, value, onChange, rows = 3, placeholder }: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <div>
      <label className="label-premium">{label}</label>
      <textarea className="input-premium resize-none" rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer py-2">
      <span className="font-sans text-sm text-anthracite">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-elegantBrown' : 'bg-anthracite/20'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </label>
  )
}
