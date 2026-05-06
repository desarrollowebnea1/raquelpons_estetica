'use client'
// app/admin/antes-despues/page.tsx
import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, ImageIcon } from 'lucide-react'
import ImageUploadField from '@/components/admin/ImageUploadField'

interface BeforeAfter {
  id: string
  title: string
  serviceName: string | null
  beforeImageUrl: string | null
  afterImageUrl: string | null
  description: string | null
  active: boolean
  sortOrder: number
}

const EMPTY_FORM = {
  title: '',
  serviceName: '',
  beforeImageUrl: '',
  afterImageUrl: '',
  description: '',
  active: true,
  sortOrder: 0,
}

export default function AdminAntesDepuesPage() {
  const [items, setItems] = useState<BeforeAfter[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/before-after')
    if (res.ok) { const d = await res.json(); setItems(d.items || []) }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openNew = () => {
    setForm({ ...EMPTY_FORM, sortOrder: items.length })
    setEditingId(null); setError(''); setShowForm(true)
  }

  const openEdit = (b: BeforeAfter) => {
    setForm({
      title: b.title, serviceName: b.serviceName || '',
      beforeImageUrl: b.beforeImageUrl || '', afterImageUrl: b.afterImageUrl || '',
      description: b.description || '', active: b.active, sortOrder: b.sortOrder,
    })
    setEditingId(b.id); setError(''); setShowForm(true)
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError('El título es obligatorio.'); return }
    setSaving(true); setError('')
    const url = editingId ? `/api/admin/before-after/${editingId}` : '/api/admin/before-after'
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
    await fetch(`/api/admin/before-after/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: val }),
    })
    fetchData()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/before-after/${id}`, { method: 'DELETE' })
    setDeleteConfirm(null); fetchData()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-3xl text-anthracite mb-1">Antes y Después</h1>
          <p className="font-sans text-sm text-anthracite/50">{items.length} caso{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={16} />Nuevo caso
        </button>
      </div>

      <div className="mb-6 bg-champagne/10 border border-champagne/30 rounded-soft p-4">
        <p className="font-sans text-xs text-elegantBrown">
          ⚠️ Recordá incluir la aclaración legal al publicar: "Las imágenes son orientativas. Los resultados pueden variar según cada persona y requieren evaluación profesional previa."
        </p>
      </div>

      {loading ? (
        <div className="card-premium p-12 text-center"><p className="font-sans text-sm text-anthracite/40">Cargando...</p></div>
      ) : items.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <p className="font-sans text-sm text-anthracite/40 mb-4">No hay casos cargados.</p>
          <button onClick={openNew} className="btn-secondary">Cargar primer caso</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(b => (
            <div key={b.id} className={`card-premium overflow-hidden ${!b.active ? 'opacity-60' : ''}`}>
              <div className="grid grid-cols-2 h-36">
                {b.beforeImageUrl ? (
                  <img src={b.beforeImageUrl} alt="Antes" className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-nude/50 flex flex-col items-center justify-center gap-1">
                    <ImageIcon size={20} className="text-anthracite/20" />
                    <span className="font-sans text-[10px] text-anthracite/30">Antes</span>
                  </div>
                )}
                {b.afterImageUrl ? (
                  <img src={b.afterImageUrl} alt="Después" className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-champagne/20 flex flex-col items-center justify-center gap-1">
                    <ImageIcon size={20} className="text-anthracite/20" />
                    <span className="font-sans text-[10px] text-anthracite/30">Después</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-sans text-sm font-medium text-anthracite mb-1">{b.title}</p>
                {b.serviceName && <p className="font-sans text-xs text-elegantBrown mb-2">{b.serviceName}</p>}
                {b.description && <p className="font-sans text-xs text-anthracite/50 line-clamp-2">{b.description}</p>}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(44,44,44,0.06)]">
                  <button onClick={() => handleToggle(b.id, !b.active)} className={`flex items-center gap-1.5 transition-colors ${b.active ? 'text-sage' : 'text-anthracite/20'}`}>
                    {b.active ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span className="font-sans text-xs">{b.active ? 'Activo' : 'Inactivo'}</span>
                  </button>
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(b)} className="p-1.5 hover:bg-nude rounded-lg transition-colors text-anthracite/50"><Pencil size={13} /></button>
                    <button onClick={() => setDeleteConfirm(b.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-anthracite/30 hover:text-red-500"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-anthracite/30 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-warmWhite rounded-soft shadow-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-[rgba(44,44,44,0.08)]">
              <h2 className="font-display text-xl text-anthracite">{editingId ? 'Editar caso' : 'Nuevo caso'}</h2>
              <button onClick={() => setShowForm(false)} className="text-anthracite/30 hover:text-anthracite text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label-premium">Título *</label>
                <input className="input-premium" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Tratamiento de manchas" />
              </div>
              <div>
                <label className="label-premium">Tratamiento relacionado (opcional)</label>
                <input className="input-premium" value={form.serviceName} onChange={e => setForm(f => ({ ...f, serviceName: e.target.value }))} placeholder="Peeling químico" />
              </div>
              <ImageUploadField
                label="Imagen ANTES"
                value={form.beforeImageUrl}
                onChange={url => setForm(f => ({ ...f, beforeImageUrl: url }))}
                folder="before-after"
                helperText="JPG, PNG o WEBP hasta 5MB"
              />
              <ImageUploadField
                label="Imagen DESPUÉS"
                value={form.afterImageUrl}
                onChange={url => setForm(f => ({ ...f, afterImageUrl: url }))}
                folder="before-after"
                helperText="JPG, PNG o WEBP hasta 5MB"
              />
              <div>
                <label className="label-premium">Descripción (opcional)</label>
                <textarea className="input-premium resize-none" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Breve descripción del caso" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-premium">Orden</label>
                  <input className="input-premium" type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-elegantBrown" />
                    <span className="font-sans text-sm text-anthracite">Activo</span>
                  </label>
                </div>
              </div>
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
            <h3 className="font-display text-xl text-anthracite mb-2">¿Eliminar caso?</h3>
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
