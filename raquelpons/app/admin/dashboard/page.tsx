// app/admin/dashboard/page.tsx
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import {
  Sparkles, Package, Calendar, MessageSquare,
  CheckCircle, AlertCircle, TrendingUp, Phone
} from 'lucide-react'

async function getStats() {
  try {
    const [
      totalServices, activeServices,
      totalProducts, activeProducts, featuredProducts,
      totalAppointments, newAppointments,
      totalInquiries, newInquiries,
      settings,
      recentAppointments,
    ] = await Promise.all([
      prisma.service.count(),
      prisma.service.count({ where: { active: true } }),
      prisma.product.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.product.count({ where: { featured: true } }),
      prisma.appointmentRequest.count(),
      prisma.appointmentRequest.count({ where: { status: 'NEW' } }),
      prisma.productInquiry.count(),
      prisma.productInquiry.count({ where: { status: 'NEW' } }),
      prisma.businessSettings.findFirst(),
      prisma.appointmentRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return {
      totalServices, activeServices, totalProducts, activeProducts, featuredProducts,
      totalAppointments, newAppointments, totalInquiries, newInquiries,
      whatsappConfigured: !!(settings?.whatsappNumber && settings.whatsappNumber !== '5493790000000'),
      recentAppointments,
    }
  } catch {
    return null
  }
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const stats = await getStats()

  const statCards = [
    { label: 'Servicios activos', value: stats?.activeServices ?? '—', total: stats?.totalServices, icon: Sparkles, color: 'text-elegantBrown' },
    { label: 'Productos activos', value: stats?.activeProducts ?? '—', total: stats?.totalProducts, icon: Package, color: 'text-sage' },
    { label: 'Reservas nuevas', value: stats?.newAppointments ?? '—', total: stats?.totalAppointments, icon: Calendar, color: 'text-champagne' },
    { label: 'Consultas nuevas', value: stats?.newInquiries ?? '—', total: stats?.totalInquiries, icon: MessageSquare, color: 'text-dustyRose' },
  ]

  const STATUS_LABELS: Record<string, string> = {
    NEW: 'Nueva',
    CONTACTED: 'Contactada',
    CONFIRMED: 'Confirmada',
    CANCELLED: 'Cancelada',
    FINISHED: 'Finalizada',
  }

  const STATUS_COLORS: Record<string, string> = {
    NEW: 'bg-champagne/20 text-elegantBrown',
    CONTACTED: 'bg-sage/20 text-sage',
    CONFIRMED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-500',
    FINISHED: 'bg-anthracite/10 text-anthracite',
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-anthracite mb-1">Dashboard</h1>
        <p className="font-sans text-sm text-anthracite/50">
          Bienvenida al panel de administración de RAQUELPONS_ESTETICA
        </p>
      </div>

      {/* Alertas */}
      {stats && !stats.whatsappConfigured && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-champagne/10 border border-champagne/30 rounded-soft text-sm font-sans text-elegantBrown">
          <AlertCircle size={16} />
          <span>
            WhatsApp aún tiene el número de ejemplo. Actualizá el número real en{' '}
            <a href="/admin/configuracion" className="underline font-medium">
              Configuración
            </a>
            .
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="card-premium p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-full bg-nude flex items-center justify-center`}>
                  <Icon size={18} className={card.color} strokeWidth={1.5} />
                </div>
                {card.total !== undefined && (
                  <span className="font-sans text-xs text-anthracite/40">
                    de {card.total}
                  </span>
                )}
              </div>
              <p className="font-display text-3xl text-anthracite mb-1">{card.value}</p>
              <p className="font-sans text-xs text-anthracite/50">{card.label}</p>
            </div>
          )
        })}
      </div>

      {/* Últimas reservas */}
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg text-anthracite">Últimas reservas de diagnóstico</h2>
          <a href="/admin/turnos" className="font-sans text-xs text-elegantBrown hover:underline">
            Ver todas →
          </a>
        </div>

        {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
          <div className="space-y-3">
            {stats.recentAppointments.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center justify-between py-3 border-b border-[rgba(44,44,44,0.06)] last:border-0"
              >
                <div className="flex-1">
                  <p className="font-sans text-sm font-medium text-anthracite">{appt.customerName}</p>
                  <p className="font-sans text-xs text-anthracite/50">
                    {appt.serviceName} · {appt.whatsapp}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-sans px-2.5 py-1 rounded-full ${STATUS_COLORS[appt.status]}`}>
                    {STATUS_LABELS[appt.status]}
                  </span>
                  <a
                    href={`https://wa.me/${appt.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-nude rounded-lg transition-colors"
                    title="Abrir WhatsApp"
                  >
                    <Phone size={13} className="text-anthracite/50" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-sans text-sm text-anthracite/40 text-center py-8">
            Aún no hay reservas registradas.
          </p>
        )}
      </div>
    </div>
  )
}
