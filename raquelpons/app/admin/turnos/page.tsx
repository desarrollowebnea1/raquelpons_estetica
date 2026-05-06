'use client'
// app/admin/turnos/page.tsx
import { useState, useEffect, useCallback } from 'react'
import { Phone, Trash2, Copy, CheckCircle } from 'lucide-react'

interface Appointment {
  id: string
  customerName: string
  whatsapp: string
  serviceName: string
  preferredDay: string | null
  preferredTime: string | null
  message: string | null
  whatsappMessage: string | null
  status: string
  createdAt: string
}

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'Nueva', color: 'bg-champagne/20 text-elegantBrown' },
  { value: 'CONTACTED', label: 'Contactada', color: 'bg-blue-100 text-blue-700' },
  { value: 'CONFIRMED', label: 'Confirmada', color: 'bg-sage/20 text-sage' },
  { value: 'CANCELLED', label: 'Cancelada', color: 'bg-red-100 text-red-500' },
  { value: 'FINISHED', label: 'Finalizada', color: 'bg-anthracite/10 text-anthracite' },
]

function statusInfo(status: string) {
  return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]
}

export default function AdminTurnosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/appointments' + (filterStatus ? `?status=${filterStatus}` : ''))
    if (res.ok) { const d = await res.json(); setAppointments(d.appointments || []) }
    setLoading(false)
  }, [filterStatus])

  useEffect(() => { fetchData() }, [fetchData])

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/admin/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchData()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/appointments/${id}`, { method: 'DELETE' })
    setDeleteConfirm(null); fetchData()
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  const newCount = appointments.filter(a => a.status === 'NEW').length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-anthracite mb-1">Reservas de Diagnóstico</h1>
          <p className="font-sans text-sm text-anthracite/50">
            {appointments.length} solicitud{appointments.length !== 1 ? 'es' : ''}
            {newCount > 0 && <span className="ml-2 bg-champagne/30 text-elegantBrown px-2 py-0.5 rounded-full text-xs">{newCount} nueva{newCount !== 1 ? 's' : ''}</span>}
          </p>
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="input-premium w-auto text-sm"
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="card-premium p-12 text-center"><p className="font-sans text-sm text-anthracite/40">Cargando...</p></div>
      ) : appointments.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <p className="font-sans text-sm text-anthracite/40">No hay reservas{filterStatus ? ' con ese estado' : ''}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map(a => {
            const si = statusInfo(a.status)
            return (
              <div key={a.id} className="card-premium p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <p className="font-sans text-sm font-semibold text-anthracite">{a.customerName}</p>
                      <span className={`text-[11px] font-sans px-2.5 py-1 rounded-full ${si.color}`}>{si.label}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                      <div>
                        <p className="font-sans text-[11px] text-anthracite/40 uppercase tracking-wider mb-0.5">Servicio</p>
                        <p className="font-sans text-xs text-anthracite">{a.serviceName}</p>
                      </div>
                      <div>
                        <p className="font-sans text-[11px] text-anthracite/40 uppercase tracking-wider mb-0.5">WhatsApp</p>
                        <p className="font-sans text-xs text-anthracite">{a.whatsapp}</p>
                      </div>
                      {a.preferredDay && (
                        <div>
                          <p className="font-sans text-[11px] text-anthracite/40 uppercase tracking-wider mb-0.5">Día preferido</p>
                          <p className="font-sans text-xs text-anthracite">{a.preferredDay}</p>
                        </div>
                      )}
                      {a.preferredTime && (
                        <div>
                          <p className="font-sans text-[11px] text-anthracite/40 uppercase tracking-wider mb-0.5">Horario</p>
                          <p className="font-sans text-xs text-anthracite">{a.preferredTime}</p>
                        </div>
                      )}
                    </div>
                    {a.message && (
                      <p className="font-sans text-xs text-anthracite/60 bg-nude/40 px-3 py-2 rounded-lg mb-2">
                        "{a.message}"
                      </p>
                    )}
                    <p className="font-sans text-[11px] text-anthracite/30">{formatDate(a.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <select
                      value={a.status}
                      onChange={e => handleStatusChange(a.id, e.target.value)}
                      className="input-premium text-xs py-1.5 w-36"
                    >
                      {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://wa.me/${a.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-sage/20 rounded-lg transition-colors text-sage"
                        title="Abrir WhatsApp"
                      >
                        <Phone size={14} />
                      </a>
                      {a.whatsappMessage && (
                        <button
                          onClick={() => handleCopy(a.whatsappMessage!, a.id)}
                          className="p-2 hover:bg-nude rounded-lg transition-colors text-anthracite/40 hover:text-anthracite"
                          title="Copiar mensaje"
                        >
                          {copied === a.id ? <CheckCircle size={14} className="text-sage" /> : <Copy size={14} />}
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(a.id)}
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
            <h3 className="font-display text-xl text-anthracite mb-2">¿Eliminar reserva?</h3>
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
