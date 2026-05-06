// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RAQUELPONS_ESTETICA | Dermocosmética profesional y estética integral',
  description:
    'Tratamientos faciales, corporales, aparatología estética, dermocosmética avanzada y boutique curada de productos premium para el cuidado de la piel en Córdoba, Argentina.',
  keywords:
    'estética, dermocosmética, tratamientos faciales, radiofrecuencia, dermapen, peeling, Córdoba, Argentina',
  authors: [{ name: 'RAQUELPONS_ESTETICA' }],
  openGraph: {
    title: 'RAQUELPONS_ESTETICA | Dermocosmética profesional',
    description:
      'Tratamientos faciales, corporales, aparatología estética y boutique curada de productos dermocosméticos premium en Córdoba, Argentina.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'RAQUELPONS_ESTETICA',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-parchment text-anthracite antialiased">{children}</body>
    </html>
  )
}
