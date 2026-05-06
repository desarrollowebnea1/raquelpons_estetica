'use client'
// app/admin/categorias/page.tsx
import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'

type Tab = 'service' | 'product' | 'skin'

interface Category {
  id: string
  name: string
  slug: string
  active: boolean
  sortOrder: number
}

const TAB_LABELS: Record<Tab, string> = {
  service: 'Categorías de servicios',
  product: 'Categorías de productos',
  skin: 'Preocupaciones de piel',
}

export default function AdminCategoriasPage() {
  const [tab, setTab] = useState<Tab>('service')
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', active: true, sortOrder: 0 })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/categories?type=${tab}`)
    if (res.ok) {
      const d = await res.json()
      setItems(d.categories || [])
    }
    setLoading(false)
  }, [tab])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleSlug = (name: string) =>
    name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')

  const openNew = () => {
    setForm({ name: '', slug: '', active: true, sortOrder: items.length })
    setEditingId(null); setError(''); setShowForm(true)
  }

  const openEdit = (c: Category) => {
    setForm({ name: c.name, slug: c.slug, active: c.active, sortOrder: c.sortOrder })
    setEditingId(c.id); setError(''); setShowForm(true)
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('El nombre es obligatorio.'); return }
    setSaving(true); setError('')
    const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories'
    const res = await fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, type: tab, sortOrder: Number(form.sortOrder) }),
    })
    setSaving(false)
    if (!res.ok) { const d = await res.json(); setError(d.error || 'Error.'); return }
    setShowForm(false); fetchItems()
  }

  const handleToggle = async (id: string, val: boolean) => {
    await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: val }),
    })
    fetchItems()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    setDeleteConfirm(null); fetchItems()
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-anthracite mb-1">Categorías</h1>
        <p className="font-sans text-sm text-anthracite/50">Administrá las categorías de servicios, productos y preocupaciones de piel</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-nude/40 rounded-soft p-1 w-fit">
        {(Object.keys(TAB_LABELS) as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-sans text-sm px-4 py-2 rounded-soft transition-all ${
              tab === t ? 'bg-warmWhite text-anthracite shadow-sm' : 'text-anthracite/50 hover:text-anthracite'
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="font-sans text-sm text-anthracite/50">{items.length} elemento{items.length !== 1 ? 's' : ''}</p>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={16} />Nuevo
        </button>
      </div>

      {loading ? (
        <div className="card-premium p-12 text-center"><p className="font-sans text-sm text-anthracite/40">Cargando...</p></div>
      ) : items.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <p className="font-sans text-sm text-anthracite/40 mb-4">No hay elementos en esta categoría.</p>
          <button onClick={openNew} className="btn-secondary">Crear primero</button>
        </div>
      ) : (
        <div className="card-premium overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(44,44,44,0.08)]">
                <th className="text-left font-sans text-xs text-anthracite/40 uppercase tracking-widest px-6 py-4">Nombre</th>
                <th className="text-left font-sans text-xs text-anthracite/40 uppercase tracking-widest px-4 py-4 hidden sm:table-cell">Slug</th>
                <th className="text-left font-sans text-xs text-anthracite/40 uppercase tracking-widest px-4 py-4 hidden md:table-cell">Orden</th>
                <th className="text-center font-sans text-xs text-anthracite/40 uppercase tracking-widest px-4 py-4">Activo</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id} className="border-b border-[rgba(44,44,44,0.06)] hover:bg-nude/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-sans text-sm font-medium text-anthracite">{c.name}</p>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="font-sans text-xs text-anthracite/40">{c.slug}</span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="font-sans text-sm text-anthracite/60">{c.sortOrder}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button onClick={() => handleToggle(c.id, !c.active)} className={`transition-colors ${c.active ? 'text-sage' : 'text-anthracite/20'}`}>
                      {c.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(c)} className="p-2 hover:bg-nude rounded-lg transition-colors text-anthracite/50 hover:text-anthracite"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteConfirm(c.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-anthracite/30 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-anthracite/30 backdrop-blur-sm">
          <div className="w-full max-w-md bg-warmWhite rounded-soft shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[rgba(44,44,44,0.08)]">
              <h2 className="font-display text-xl text-anthracite">{editingId ? 'Editar' : 'Nuevo'}</h2>
              <button onClick={() => setShowForm(false)} className="text-anthracite/30 hover:text-anthracite text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label-premium">Nombre *</label>
                <input className="input-premium" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: handleSlug(e.target.value) }))} />
              </div>
              <div>
                <label className="label-premium">Slug</label>
                <input className="input-premium" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
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
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-anthracite/30 backdrop-blur-sm">
          <div className="bg-warmWhite rounded-soft p-8 max-w-sm w-full shadow-2xl">
            <h3 className="font-display text-xl text-anthracite mb-2">¿Eliminar?</h3>
            <p className="font-sans text-sm text-anthracite/60 mb-6">Si tiene elementos asociados, no se podrá eliminar.</p>
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
