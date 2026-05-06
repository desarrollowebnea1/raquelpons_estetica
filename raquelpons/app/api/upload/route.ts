// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'raquelpons-estetica'
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'Supabase Storage no configurado. Configurá las variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.' },
      { status: 503 }
    )
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'misc'

    if (!file) return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido. Solo JPG, PNG, WEBP o GIF.' }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'El archivo supera el tamaño máximo de 10MB.' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const uniqueName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const arrayBuffer = await file.arrayBuffer()

    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${uniqueName}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': file.type,
          'x-upsert': 'true',
        },
        body: arrayBuffer,
      }
    )

    if (!uploadRes.ok) {
      const errText = await uploadRes.text()
      console.error('Supabase upload error:', errText)
      return NextResponse.json({ error: 'Error al subir imagen a Supabase Storage.' }, { status: 500 })
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${uniqueName}`
    return NextResponse.json({ url: publicUrl })
  } catch (e) {
    console.error('Upload error:', e)
    return NextResponse.json({ error: 'Error interno al procesar la imagen.' }, { status: 500 })
  }
}
