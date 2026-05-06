'use client'
// app/admin/consultas-productos/page.tsx
import { useState, useEffect, useCallback } from 'react'
import { Phone, Trash2, Copy, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { formatCurrencyARS } from '@/lib/utils'

interface InquiryItem {
  id: string
  productName: string
  quantity: number
  unitPrice: number | null
  totalPrice: number | null
}

interface Inquiry {
  id: string
  customerName: string
  whatsapp: string
  message: string | null
  subtotal: number | null
  whatsappMessage: string | null
  status: string
  createdAt: string
  items: InquiryItem[]
}

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'Nueva', color: 'bg-champagne/20 text-elegantBrown' },
  { value: 'CONTACTED', label: 'Contactada', color: 'bg-blue-100 text-blue-700' },
  { value: 'PAYMENT_PENDING', label: 'Pago pendiente', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'DELIVERED', label: 'Entregada', color: 'bg-sage/20 text-sage' },
  { value: 'CANCELLED', label: 'Cancelada', color: 'bg-red-100 text-red-500' },
]

function statusInfo(status: string) {
  return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]
}

export default function AdminConsultasPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/inquiries' + (filterStatus ? `?status=${filterStatus}` : ''))
    if (res.ok) { const d = await res.json(); setInquiries(d.inquiries || []) }
    setLoading(false)
  }, [filterStatus])

  useEffect(() => { fetchData() }, [fetchData])

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchData()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' })
    setDeleteConfirm(null); fetchData()
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })

  const newCount = inquiries.filter(i => i.status === 'NEW').length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-anthracite mb-1">Consultas de Productos</h1>
          <p className="font-sans text-sm text-anthracite/50">
            {inquiries.length} consulta{inquiries.length !== 1 ? 's' : ''}
            {newCount > 0 && <span className="ml-2 bg-champagne/30 text-elegantBrown px-2 py-0.5 rounded-full text-xs">{newCount} nueva{newCount !== 1 ? 's' : ''}</span>}
          </p>
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-premium w-auto text-sm">
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="card-premium p-12 text-center"><p className="font-sans text-sm text-anthracite/40">Cargando...</p></div>
      ) : inquiries.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <p className="font-sans text-sm text-anthracite/40">No hay consultas{filterStatus ? ' con ese estado' : ''}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map(inq => {
            const si = statusInfo(inq.status)
            const isExpanded = expanded === inq.id
            return (
              <div key={inq.id} className="card-premium p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <p className="font-sans text-sm font-semibold text-anthracite">{inq.customerName}</p>
                      <span className={`text-[11px] font-sans px-2.5 py-1 rounded-full ${si.color}`}>{si.label}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <div>
                        <p className="font-sans text-[11px] text-anthracite/40 uppercase tracking-wider mb-0.5">WhatsApp</p>
                        <p className="font-sans text-xs text-anthracite">{inq.whatsapp}</p>
                      </div>
                      <div>
                        <p className="font-sans text-[11px] text-anthracite/40 uppercase tracking-wider mb-0.5">Productos</p>
                        <p className="font-sans text-xs text-anthracite">{inq.items?.length || 0} ítem{inq.items?.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div>
                        <p className="font-sans text-[11px] text-anthracite/40 uppercase tracking-wider mb-0.5">Total estimado</p>
                        <p className="font-sans text-xs font-medium text-anthracite">{formatCurrencyARS(inq.subtotal)}</p>
                      </div>
                    </div>
                    {inq.message && (
                      <p className="font-sans text-xs text-anthracite/60 bg-nude/40 px-3 py-2 rounded-lg mb-2">"{inq.message}"</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <p className="font-sans text-[11px] text-anthracite/30">{formatDate(inq.createdAt)}</p>
                      {inq.items && inq.items.length > 0 && (
                        <button
                          onClick={() => setExpanded(isExpanded ? null : inq.id)}
                          className="font-sans text-xs text-elegantBrown hover:underline flex items-center gap-1"
                        >
                          {isExpanded ? <><ChevronUp size={12} />Ocultar detalle</> : <><ChevronDown size={12} />Ver detalle</>}
                        </button>
                      )}
                    </div>
                    {isExpanded && inq.items && (
                      <div className="mt-3 bg-nude/30 rounded-lg p-3 space-y-1.5">
                        {inq.items.map(item => (
                          <div key={item.id} className="flex items-center justify-between">
                            <p className="font-sans text-xs text-anthracite">{item.quantity}× {item.productName}</p>
                            <p className="font-sans text-xs text-anthracite/60">{formatCurrencyARS(item.totalPrice)}</p>
                          </div>
                        ))}
                        <div className="border-t border-[rgba(44,44,44,0.08)] pt-1.5 flex justify-between">
                          <p className="font-sans text-xs font-medium text-anthracite">Total estimado</p>
                          <p className="font-sans text-xs font-semibold text-elegantBrown">{formatCurrencyARS(inq.subtotal)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <select
                      value={inq.status}
                      onChange={e => handleStatusChange(inq.id, e.target.value)}
                      className="input-premium text-xs py-1.5 w-40"
                    >
                      {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://wa.me/${inq.whatsapp.replace(/\D/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="p-2 hover:bg-sage/20 rounded-lg transition-colors text-sage"
                        title="Abrir WhatsApp"
                      >
                        <Phone size={14} />
                      </a>
                      {inq.whatsappMessage && (
                        <button
                          onClick={() => handleCopy(inq.whatsappMessage!, inq.id)}
                          className="p-2 hover:bg-nude rounded-lg transition-colors text-anthracite/40 hover:text-anthracite"
                          title="Copiar mensaje"
                        >
                          {copied === inq.id ? <CheckCircle size={14} className="text-sage" /> : <Copy size={14} />}
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(inq.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-anthracite/30 hover:text-red-500"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-anthracite/30 backdrop-blur-sm">
          <div className="bg-warmWhite rounded-soft p-8 max-w-sm w-full shadow-2xl">
            <h3 className="font-display text-xl text-anthracite mb-2">¿Eliminar consulta?</h3>
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
