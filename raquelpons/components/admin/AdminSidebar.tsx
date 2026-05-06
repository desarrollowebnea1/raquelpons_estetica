'use client'
// components/admin/AdminSidebar.tsx
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Sparkles, Package, Tag, Calendar, MessageSquare,
  Star, Image, Settings, LogOut, ChevronRight, FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Servicios', href: '/admin/servicios', icon: Sparkles },
  { label: 'Productos', href: '/admin/productos', icon: Package },
  { label: 'Categorías', href: '/admin/categorias', icon: Tag },
  { label: 'Reservas', href: '/admin/turnos', icon: Calendar },
  { label: 'Consultas', href: '/admin/consultas-productos', icon: MessageSquare },
  { label: 'Testimonios', href: '/admin/testimonios', icon: Star },
  { label: 'Antes/Después', href: '/admin/antes-despues', icon: Image },
  { label: 'Contenido editable', href: '/admin/contenido', icon: FileText },
  { label: 'Configuración', href: '/admin/configuracion', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-anthracite flex flex-col">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-warmWhite/10">
        <p className="font-display text-sm font-medium text-warmWhite tracking-wide">RAQUELPONS</p>
        <p className="text-[10px] font-sans tracking-ultraspaced text-champagne uppercase mt-0.5">
          Panel Admin
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'admin-nav-item',
                isActive && 'active'
              )}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={12} className="text-champagne" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-warmWhite/10">
        <button
          onClick={handleLogout}
          className="admin-nav-item w-full hover:text-red-300"
        >
          <LogOut size={16} strokeWidth={1.5} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
