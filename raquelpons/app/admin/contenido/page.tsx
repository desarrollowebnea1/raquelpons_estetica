'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'

type SiteContent = {
  id: string
  section: string
  key: string
  label: string
  value: string
  type: string
  sortOrder: number
}

export default function AdminContenidoPage() {
  const [items, setItems] = useState<SiteContent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/site-content')
      .then(r => r.json())
      .then(d => {
        setItems(d.items || [])
        setLoading(false)
      })
      .catch(() => {
        setError('No se pudo cargar el contenido.')
        setLoading(false)
      })
  }, [])

  const update = (id: string, value: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, value } : item))
  }

  const save = async () => {
    setSaving(true)
    setSaved(false)
    setError('')

    const res = await fetch('/api/admin/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })

    setSaving(false)

    if (!res.ok) {
      setError('No se pudo guardar el contenido.')
      return
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const grouped = items.reduce<Record<string, SiteContent[]>>((acc, item) => {
    acc[item.section] ||= []
    acc[item.section].push(item)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="p-8">
        <p className="font-sans text-sm text-anthracite/50">Cargando contenido editable...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-anthracite mb-1">Contenido editable</h1>
          <p className="font-sans text-sm text-anthracite/50">
            Editá textos visibles de la web pública: formación, tratamientos y diagnóstico.
          </p>
        </div>

        <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save size={16} />
          {saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar cambios'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm font-sans text-red-600">
          {error}
        </div>
      )}

      {saved && (
        <div className="mb-4 p-3 bg-sage/20 border border-sage/30 rounded-lg text-sm font-sans text-sage">
          ✓ Contenido guardado correctamente.
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(grouped).map(([section, sectionItems]) => (
          <div key={section} className="card-premium p-6">
            <h2 className="font-display text-xl text-anthracite mb-5 capitalize">
              {section}
            </h2>

            <div className="space-y-4">
              {sectionItems.map(item => (
                <div key={item.id}>
                  <label className="label-premium">{item.label}</label>
                  <textarea
                    className="input-premium resize-none"
                    rows={item.value.length > 90 ? 3 : 1}
                    value={item.value}
                    onChange={e => update(item.id, e.target.value)}
                  />
                  <p className="font-sans text-[11px] text-anthracite/35 mt-1">{item.key}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save size={16} />
          {saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
