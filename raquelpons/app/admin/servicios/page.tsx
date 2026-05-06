'use client'
// app/admin/servicios/page.tsx
import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff, Phone } from 'lucide-react'
import { formatCurrencyARS } from '@/lib/utils'
import ImageUploadField from '@/components/admin/ImageUploadField'

interface Service {
  id: string
  name: string
  slug: string
  objective: string | null
  sensation: string | null
  treatmentTime: string | null
  shortDescription: string | null
  longDescription: string | null
  price: number | null
  imageUrl: string | null
  active: boolean
  featured: boolean
  sortOrder: number
  category: { id: string; name: string } | null
}

interface Category {
  id: string
  name: string
}

const EMPTY_FORM = {
  name: '',
  slug: '',
  categoryId: '',
  objective: '',
  sensation: '',
  treatmentTime: '',
  shortDescription: '',
  longDescription: '',
  benefits: '',
  contraindications: '',
  duration: '',
  price: '',
  imageUrl: '',
  active: true,
  featured: false,
  sortOrder: 0,
}

export default function AdminServiciosPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [sRes, cRes] = await Promise.all([
      fetch('/api/admin/services'),
      fetch('/api/admin/categories?type=service'),
    ])
    if (sRes.ok) {
      const data = await sRes.json()
      setServices(data.services || [])
    }
    if (cRes.ok) {
      const data = await cRes.json()
      setCategories(data.categories || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openNew = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setError('')
    setShowForm(true)
  }

  const openEdit = (s: Service) => {
    setForm({
      name: s.name,
      slug: s.slug,
      categoryId: s.category?.id || '',
      objective: s.objective || '',
      sensation: s.sensation || '',
      treatmentTime: s.treatmentTime || '',
      shortDescription: s.shortDescription || '',
      longDescription: '',
      benefits: '',
      contraindications: '',
      duration: '',
      price: s.price?.toString() || '',
      imageUrl: s.imageUrl || '',
      active: s.active,
      featured: s.featured,
      sortOrder: s.sortOrder,
    })
    setEditingId(s.id)
    setError('')
    setShowForm(true)
  }

  const handleSlug = (name: string) => {
    return name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim().replace(/\s+/g, '-')
  }

  const handleNameChange = (v: string) => {
    setForm(f => ({ ...f, name: v, slug: handleSlug(v) }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('El nombre es obligatorio.'); return }
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      price: form.price ? parseFloat(form.price) : null,
      sortOrder: Number(form.sortOrder),
    }
    const url = editingId ? `/api/admin/services/${editingId}` : '/api/admin/services'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (!res.ok) {
      const d = await res.json()
      setError(typeof d.error === 'string' ? d.error : 'Error de validación. Revisá los campos obligatorios.')
      return
    }
    setShowForm(false)
    fetchData()
  }

  const handleToggle = async (id: string, field: 'active' | 'featured', val: boolean) => {
    await fetch(`/api/admin/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: val }),
    })
    fetchData()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
    setDeleteConfirm(null)
    fetchData()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-anthracite mb-1">Servicios</h1>
          <p className="font-sans text-sm text-anthracite/50">{services.length} servicio{services.length !== 1 ? 's' : ''} registrado{services.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Nuevo servicio
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="card-premium p-12 text-center">
          <p className="font-sans text-sm text-anthracite/40">Cargando servicios...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <p className="font-sans text-sm text-anthracite/40 mb-4">No hay servicios cargados.</p>
          <button onClick={openNew} className="btn-secondary">Crear primer servicio</button>
        </div>
      ) : (
        <div className="card-premium overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(44,44,44,0.08)]">
                <th className="text-left font-sans text-xs text-anthracite/40 uppercase tracking-widest px-6 py-4">Nombre</th>
                <th className="text-left font-sans text-xs text-anthracite/40 uppercase tracking-widest px-4 py-4 hidden md:table-cell">Categoría</th>
                <th className="text-left font-sans text-xs text-anthracite/40 uppercase tracking-widest px-4 py-4 hidden lg:table-cell">Precio</th>
                <th className="text-center font-sans text-xs text-anthracite/40 uppercase tracking-widest px-4 py-4">Activo</th>
                <th className="text-center font-sans text-xs text-anthracite/40 uppercase tracking-widest px-4 py-4 hidden sm:table-cell">Destac.</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-[rgba(44,44,44,0.06)] hover:bg-nude/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-sans text-sm font-medium text-anthracite">{s.name}</p>
                    <p className="font-sans text-xs text-anthracite/40">{s.slug}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="font-sans text-xs text-anthracite/60">{s.category?.name || '—'}</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="font-sans text-sm text-anthracite">{formatCurrencyARS(s.price)}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleToggle(s.id, 'active', !s.active)}
                      className={`transition-colors ${s.active ? 'text-sage' : 'text-anthracite/20'}`}
                    >
                      {s.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-center hidden sm:table-cell">
                    <button
                      onClick={() => handleToggle(s.id, 'featured', !s.featured)}
                      className={`transition-colors ${s.featured ? 'text-champagne' : 'text-anthracite/20'}`}
                    >
                      {s.featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(s)}
                        className="p-2 hover:bg-nude rounded-lg transition-colors text-anthracite/50 hover:text-anthracite"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(s.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-anthracite/30 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-anthracite/30 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-warmWhite rounded-soft shadow-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-[rgba(44,44,44,0.08)]">
              <h2 className="font-display text-xl text-anthracite">
                {editingId ? 'Editar servicio' : 'Nuevo servicio'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-anthracite/30 hover:text-anthracite text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-premium">Nombre *</label>
                  <input className="input-premium" value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="Higiene facial profunda" />
                </div>
                <div>
                  <label className="label-premium">Slug</label>
                  <input className="input-premium" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="higiene-facial-profunda" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-premium">Categoría</label>
                  <select className="input-premium" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                    <option value="">Sin categoría</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-premium">Precio (0 = Consultar)</label>
                  <input className="input-premium" type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="label-premium">Objetivo</label>
                <input className="input-premium" value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))} placeholder="Estimular circulación y drenaje" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-premium">Sensación</label>
                  <input className="input-premium" value={form.sensation} onChange={e => setForm(f => ({ ...f, sensation: e.target.value }))} placeholder="Relajante y confortable" />
                </div>
                <div>
                  <label className="label-premium">Duración / Tiempo</label>
                  <input className="input-premium" value={form.treatmentTime} onChange={e => setForm(f => ({ ...f, treatmentTime: e.target.value }))} placeholder="60 min · Consultar" />
                </div>
              </div>
              <div>
                <label className="label-premium">Descripción corta</label>
                <textarea className="input-premium resize-none" rows={2} value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} placeholder="Descripción breve para cards" />
              </div>
              <div>
                <label className="label-premium">Descripción larga</label>
                <textarea className="input-premium resize-none" rows={3} value={form.longDescription} onChange={e => setForm(f => ({ ...f, longDescription: e.target.value }))} placeholder="Descripción completa del tratamiento" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-premium">Beneficios</label>
                  <textarea className="input-premium resize-none" rows={2} value={form.benefits} onChange={e => setForm(f => ({ ...f, benefits: e.target.value }))} placeholder="Un beneficio por línea" />
                </div>
                <div>
                  <label className="label-premium">Contraindicaciones (opcional)</label>
                  <textarea className="input-premium resize-none" rows={2} value={form.contraindications} onChange={e => setForm(f => ({ ...f, contraindications: e.target.value }))} placeholder="Opcional" />
                </div>
              </div>
              <div>
                <label className="label-premium">URL de imagen</label>
                <input className="input-premium" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
              </div>
              <ImageUploadField
                label="Imagen del servicio/tratamiento"
                value={form.imageUrl}
                onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
                folder="services"
                helperText="JPG, PNG o WEBP hasta 5MB"
              />
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label-premium">Orden</label>
                  <input className="input-premium" type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
                </div>
                <div className="flex items-end gap-3 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-elegantBrown" />
                    <span className="font-sans text-sm text-anthracite">Activo</span>
                  </label>
                </div>
                <div className="flex items-end gap-3 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-elegantBrown" />
                    <span className="font-sans text-sm text-anthracite">Destacado</span>
                  </label>
                </div>
              </div>
              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-[rgba(44,44,44,0.08)]">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
              <button onClick={handleSubmit} disabled={saving} className="btn-primary">
                {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear servicio'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-anthracite/30 backdrop-blur-sm">
          <div className="bg-warmWhite rounded-soft p-8 max-w-sm w-full shadow-2xl">
            <h3 className="font-display text-xl text-anthracite mb-2">¿Eliminar servicio?</h3>
            <p className="font-sans text-sm text-anthracite/60 mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1 justify-center">Cancelar</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white rounded-organic px-4 py-2 font-sans text-sm hover:bg-red-600 transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
