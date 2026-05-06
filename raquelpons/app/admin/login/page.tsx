'use client'
// app/admin/login/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Credenciales incorrectas')
      return
    }

    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-anthracite rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={20} className="text-champagne" />
          </div>
          <p className="font-display text-2xl text-anthracite mb-1">Panel Admin</p>
          <p className="font-sans text-xs tracking-ultraspaced text-elegantBrown uppercase">
            RAQUELPONS_ESTETICA
          </p>
        </div>

        {/* Form */}
        <div className="card-premium p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="label-premium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@raquelponsestetica.com"
                className="input-premium"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="label-premium" htmlFor="password">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-premium pr-10"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-anthracite/40 hover:text-anthracite transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? 'Iniciando sesión...' : 'Ingresar al panel'}
            </button>
          </form>

          <p className="text-[11px] font-sans text-anthracite/30 text-center mt-6">
            ⚠️ Cambiá la contraseña por defecto antes de publicar en producción.
          </p>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="text-xs font-sans text-anthracite/40 hover:text-anthracite transition-colors">
            ← Volver al sitio
          </a>
        </p>
      </div>
    </div>
  )
}
