// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createToken, COOKIE_NAME } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Email o contraseña inválidos' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({ success: true, email: user.email })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
