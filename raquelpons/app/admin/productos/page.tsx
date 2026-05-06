'use client'
// app/admin/productos/page.tsx
import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff } from 'lucide-react'
import { formatCurrencyARS } from '@/lib/utils'
import ImageUploadField from '@/components/admin/ImageUploadField'

interface Product {
  id: string
  name: string
  slug: string
  brand: string | null
  laboratory: string | null
  description: string | null
  price: number | null
  stock: number | null
  imageUrl: string | null
  usage: string | null
  warnings: string | null
  active: boolean
  featured: boolean
  sortOrder: number
  category: { id: string; name: string } | null
  skinConcern: { id: string; name: string } | null
}

interface Category { id: string; name: string }
interface SkinConcern { id: string; name: string }

const EMPTY_FORM = {
  name: '', slug: '', brand: '', laboratory: '',
  categoryId: '', skinConcernId: '',
  description: '', price: '', stock: '',
  imageUrl: '', usage: '', warnings: '',
  active: true, featured: false, sortOrder: 0,
}

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [skinConcerns, setSkinConcerns] = useState<SkinConcern[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [pRes, cRes, scRes] = await Promise.all([
      fetch('/api/admin/products'),
      fetch('/api/admin/categories?type=product'),
      fetch('/api/admin/categories?type=skin'),
    ])
    if (pRes.ok) { const d = await pRes.json(); setProducts(d.products || []) }
    if (cRes.ok) { const d = await cRes.json(); setCategories(d.categories || []) }
    if (scRes.ok) { const d = await scRes.json(); setSkinConcerns(d.categories || []) }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSlug = (name: string) =>
    name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')

  const openNew = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(true) }

  const openEdit = (p: Product) => {
    setForm({
      name: p.name, slug: p.slug, brand: p.brand || '', laboratory: p.laboratory || '',
      categoryId: p.category?.id || '', skinConcernId: p.skinConcern?.id || '',
      description: p.description || '', price: p.price?.toString() || '', stock: p.stock?.toString() || '',
      imageUrl: p.imageUrl || '', usage: p.usage || '', warnings: p.warnings || '',
      active: p.active, featured: p.featured, sortOrder: p.sortOrder,
    })
    setEditingId(p.id); setError(''); setShowForm(true)
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('El nombre es obligatorio.'); return }
    setSaving(true); setError('')
    const payload = {
      ...form,
      price: form.price ? parseFloat(form.price) : null,
      stock: form.stock ? parseInt(form.stock) : null,
      imageUrl: form.imageUrl || null,
      categoryId: form.categoryId || null,
      skinConcernId: form.skinConcernId || null,
      sortOrder: Number(form.sortOrder),
    }
    const url = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products'
    const res = await fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (!res.ok) { const d = await res.json(); setError(typeof d.error === 'string' ? d.error : 'Error de validación. Revisá los campos obligatorios.'); return }
    setShowForm(false); fetchData()
  }

  const handleToggle = async (id: string, field: 'active' | 'featured', val: boolean) => {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: val }),
    })
    fetchData()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    setDeleteConfirm(null); fetchData()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-anthracite mb-1">Productos</h1>
          <p className="font-sans text-sm text-anthracite/50">{products.length} producto{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={16} />Nuevo producto
        </button>
      </div>

      {loading ? (
        <div className="card-premium p-12 text-center"><p className="font-sans text-sm text-anthracite/40">Cargando...</p></div>
      ) : products.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <p className="font-sans text-sm text-anthracite/40 mb-4">No hay productos cargados.</p>
          <button onClick={openNew} className="btn-secondary">Crear primer producto</button>
        </div>
      ) : (
        <div className="card-premium overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(44,44,44,0.08)]">
                <th className="text-left font-sans text-xs text-anthracite/40 uppercase tracking-widest px-6 py-4">Nombre</th>
                <th className="text-left font-sans text-xs text-anthracite/40 uppercase tracking-widest px-4 py-4 hidden md:table-cell">Marca</th>
                <th className="text-left font-sans text-xs text-anthracite/40 uppercase tracking-widest px-4 py-4 hidden lg:table-cell">Precio</th>
                <th className="text-center font-sans text-xs text-anthracite/40 uppercase tracking-widest px-4 py-4">Activo</th>
                <th className="text-center font-sans text-xs text-anthracite/40 uppercase tracking-widest px-4 py-4 hidden sm:table-cell">Destac.</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-[rgba(44,44,44,0.06)] hover:bg-nude/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-sans text-sm font-medium text-anthracite">{p.name}</p>
                    <p className="font-sans text-xs text-anthracite/40">{p.category?.name || '—'}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="font-sans text-xs text-anthracite/60">{p.brand || '—'}</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="font-sans text-sm text-anthracite">{formatCurrencyARS(p.price)}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button onClick={() => handleToggle(p.id, 'active', !p.active)} className={`transition-colors ${p.active ? 'text-sage' : 'text-anthracite/20'}`}>
                      {p.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-center hidden sm:table-cell">
                    <button onClick={() => handleToggle(p.id, 'featured', !p.featured)} className={`transition-colors ${p.featured ? 'text-champagne' : 'text-anthracite/20'}`}>
                      {p.featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="p-2 hover:bg-nude rounded-lg transition-colors text-anthracite/50 hover:text-anthracite"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteConfirm(p.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-anthracite/30 hover:text-red-500"><Trash2 size={14} /></button>
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
              <h2 className="font-display text-xl text-anthracite">{editingId ? 'Editar producto' : 'Nuevo producto'}</h2>
              <button onClick={() => setShowForm(false)} className="text-anthracite/30 hover:text-anthracite text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-premium">Nombre *</label>
                  <input className="input-premium" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: handleSlug(e.target.value) }))} placeholder="Vitalil Suplemento" />
                </div>
                <div>
                  <label className="label-premium">Slug</label>
                  <input className="input-premium" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-premium">Marca</label>
                  <input className="input-premium" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Vitalil" />
                </div>
                <div>
                  <label className="label-premium">Laboratorio</label>
                  <input className="input-premium" value={form.laboratory} onChange={e => setForm(f => ({ ...f, laboratory: e.target.value }))} placeholder="Laboratorio Linfar" />
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
                  <label className="label-premium">Preocupación de piel</label>
                  <select className="input-premium" value={form.skinConcernId} onChange={e => setForm(f => ({ ...f, skinConcernId: e.target.value }))}>
                    <option value="">Sin especificar</option>
                    {skinConcerns.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label-premium">Descripción</label>
                <textarea className="input-premium resize-none" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label-premium">Precio (0 = Consultar)</label>
                  <input className="input-premium" type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" />
                </div>
                <div>
                  <label className="label-premium">Stock (opcional)</label>
                  <input className="input-premium" type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                </div>
                <div>
                  <label className="label-premium">Orden</label>
                  <input className="input-premium" type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
                </div>
              </div>
              <div>
                <label className="label-premium">Experiencia</label>
                <textarea className="input-premium resize-none" rows={2} value={form.usage} onChange={e => setForm(f => ({ ...f, usage: e.target.value }))} />
              </div>
              <div>
                <label className="label-premium">Advertencias (opcional)</label>
                <textarea className="input-premium resize-none" rows={2} value={form.warnings} onChange={e => setForm(f => ({ ...f, warnings: e.target.value }))} />
              </div>
              <ImageUploadField
                label="Imagen del producto"
                value={form.imageUrl}
                onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
                folder="products"
                helperText="JPG, PNG o WEBP hasta 5MB"
              />
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-elegantBrown" />
                  <span className="font-sans text-sm text-anthracite">Activo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-elegantBrown" />
                  <span className="font-sans text-sm text-anthracite">Destacado</span>
                </label>
              </div>
              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-[rgba(44,44,44,0.08)]">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
              <button onClick={handleSubmit} disabled={saving} className="btn-primary">
                {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-anthracite/30 backdrop-blur-sm">
          <div className="bg-warmWhite rounded-soft p-8 max-w-sm w-full shadow-2xl">
            <h3 className="font-display text-xl text-anthracite mb-2">¿Eliminar producto?</h3>
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
