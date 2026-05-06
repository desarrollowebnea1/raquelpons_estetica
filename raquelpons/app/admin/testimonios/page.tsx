'use client'
// app/admin/testimonios/page.tsx
import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'

interface Testimonial {
  id: string
  customerName: string
  text: string
  serviceName: string | null
  active: boolean
  sortOrder: number
  createdAt: string
}

const EMPTY_FORM = { customerName: '', text: '', serviceName: '', active: true, sortOrder: 0 }

export default function AdminTestimoniosPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/testimonials')
    if (res.ok) { const d = await res.json(); setItems(d.testimonials || []) }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openNew = () => {
    setForm({ ...EMPTY_FORM, sortOrder: items.length })
    setEditingId(null); setError(''); setShowForm(true)
  }

  const openEdit = (t: Testimonial) => {
    setForm({ customerName: t.customerName, text: t.text, serviceName: t.serviceName || '', active: t.active, sortOrder: t.sortOrder })
    setEditingId(t.id); setError(''); setShowForm(true)
  }

  const handleSubmit = async () => {
    if (!form.customerName.trim() || !form.text.trim()) { setError('Nombre y texto son obligatorios.'); return }
    setSaving(true); setError('')
    const url = editingId ? `/api/admin/testimonials/${editingId}` : '/api/admin/testimonials'
    const res = await fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) }),
    })
    setSaving(false)
    if (!res.ok) { const d = await res.json(); setError(d.error || 'Error.'); return }
    setShowForm(false); fetchData()
  }

  const handleToggle = async (id: string, val: boolean) => {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: val }),
    })
    fetchData()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    setDeleteConfirm(null); fetchData()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-anthracite mb-1">Testimonios</h1>
          <p className="font-sans text-sm text-anthracite/50">{items.length} testimonio{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={16} />Nuevo testimonio
        </button>
      </div>

      {loading ? (
        <div className="card-premium p-12 text-center"><p className="font-sans text-sm text-anthracite/40">Cargando...</p></div>
      ) : items.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <p className="font-sans text-sm text-anthracite/40 mb-4">No hay testimonios cargados.</p>
          <button onClick={openNew} className="btn-secondary">Crear primero</button>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map(t => (
            <div key={t.id} className="card-premium p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-sans text-sm font-semibold text-anthracite">{t.customerName}</p>
                    {t.serviceName && <span className="font-sans text-xs text-elegantBrown bg-champagne/15 px-2 py-0.5 rounded-full">{t.serviceName}</span>}
                    {!t.active && <span className="font-sans text-xs text-anthracite/30 bg-anthracite/8 px-2 py-0.5 rounded-full">Inactivo</span>}
                  </div>
                  <p className="font-sans text-sm text-anthracite/70 leading-relaxed">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleToggle(t.id, !t.active)} className={`p-2 rounded-lg transition-colors ${t.active ? 'text-sage hover:bg-sage/10' : 'text-anthracite/20 hover:bg-nude'}`}>
                    {t.active ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => openEdit(t)} className="p-2 hover:bg-nude rounded-lg transition-colors text-anthracite/50 hover:text-anthracite"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteConfirm(t.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-anthracite/30 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-anthracite/30 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-warmWhite rounded-soft shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[rgba(44,44,44,0.08)]">
              <h2 className="font-display text-xl text-anthracite">{editingId ? 'Editar testimonio' : 'Nuevo testimonio'}</h2>
              <button onClick={() => setShowForm(false)} className="text-anthracite/30 hover:text-anthracite text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label-premium">Nombre del cliente *</label>
                <input className="input-premium" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} placeholder="Laura M." />
              </div>
              <div>
                <label className="label-premium">Testimonio *</label>
                <textarea className="input-premium resize-none" rows={4} value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} placeholder="Excelente atención y resultados..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-premium">Tratamiento (opcional)</label>
                  <input className="input-premium" value={form.serviceName} onChange={e => setForm(f => ({ ...f, serviceName: e.target.value }))} placeholder="Higiene facial profunda" />
                </div>
                <div>
                  <label className="label-premium">Orden</label>
                  <input className="input-premium" type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-elegantBrown" />
                <span className="font-sans text-sm text-anthracite">Activo</span>
              </label>
              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-[rgba(44,44,44,0.08)]">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
              <button onClick={handleSubmit} disabled={saving} className="btn-primary">
                {saving ? 'Guardando...' : editingId ? 'Guardar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-anthracite/30 backdrop-blur-sm">
          <div className="bg-warmWhite rounded-soft p-8 max-w-sm w-full shadow-2xl">
            <h3 className="font-display text-xl text-anthracite mb-2">¿Eliminar testimonio?</h3>
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
