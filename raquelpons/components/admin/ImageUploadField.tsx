'use client'

import { useState, useRef } from 'react'
import { Upload, X, CheckCircle, AlertCircle, Loader } from 'lucide-react'

interface ImageUploadFieldProps {
  label: string
  value: string | null
  onChange: (url: string) => void
  folder: 'logos' | 'hero' | 'products' | 'services' | 'before-after' | 'misc'
  helperText?: string
  onError?: (error: string) => void
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  helperText = 'JPG, PNG o WEBP hasta 5MB',
  onError,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(value || null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      const msg = 'Solo se permiten archivos JPG, PNG o WEBP'
      setError(msg)
      onError?.(msg)
      return
    }

    // Validar tamaño (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      const msg = 'El archivo supera 5MB'
      setError(msg)
      onError?.(msg)
      return
    }

    // Mostrar preview local
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Subir
    setUploading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error en la subida')
      }

      const data = await res.json()
      onChange(data.url)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setError(msg)
      onError?.(msg)
    } finally {
      setUploading(false)
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    onChange('')
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <label className="label-premium">{label}</label>

      <div className="space-y-3">
        {/* Preview */}
        {preview && (
          <div className="relative w-full max-w-xs bg-nude rounded-soft overflow-hidden border border-[rgba(44,44,44,0.1)]">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Input + Button */}
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-soft font-sans text-sm transition-all ${
              uploading
                ? 'bg-anthracite/40 text-anthracite/50 cursor-not-allowed'
                : 'bg-nude hover:bg-nude/80 text-anthracite cursor-pointer'
            }`}
          >
            {uploading ? (
              <>
                <Loader size={14} className="animate-spin" />
                Subiendo…
              </>
            ) : (
              <>
                <Upload size={14} />
                Abrir archivo
              </>
            )}
          </button>

          {success && (
            <div className="flex items-center gap-1 text-xs text-sage">
              <CheckCircle size={14} />
              Cargado
            </div>
          )}

          {error && (
            <div className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </div>

        {/* Helper text */}
        <p className="font-sans text-xs text-anthracite/40">{helperText}</p>

        {/* URL manual como fallback */}
        <div>
          <label className="font-sans text-xs font-medium text-anthracite/50 uppercase tracking-wider mb-1 block">
            O pegar URL directa
          </label>
          <input
            type="url"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder="https://..."
            className="input-premium text-sm"
          />
        </div>
      </div>
    </div>
  )
}
