// app/page.tsx
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/public/Navbar'
import HeroTheGlow from '@/components/public/HeroTheGlow'
import TrustBadges from '@/components/public/TrustBadges'
import AboutProfessional from '@/components/public/AboutProfessional'
import ScientificAuthoritySection from '@/components/public/ScientificAuthoritySection'
import TreatmentMenu from '@/components/public/TreatmentMenu'
import CuratedBoutique from '@/components/public/CuratedBoutique'
import AppointmentForm from '@/components/public/AppointmentForm'
import TestimonialsSection from '@/components/public/TestimonialsSection'
import ContactSection from '@/components/public/ContactSection'
import PremiumFooter from '@/components/public/PremiumFooter'
import FloatingWhatsApp from '@/components/public/FloatingWhatsApp'
import type { BusinessSettings, Service, ServiceCategory, Product, ProductCategory, SkinConcern, Testimonial } from '@/types'

// Datos fallback para cuando no hay base de datos
const fallbackSettings: BusinessSettings = {
  id: 'default',
  brandName: 'RAQUELPONS_ESTETICA',
  slogan: 'Dermocosmética profesional y estética integral',
  heroTitle: 'Dermocosmética profesional para una piel que respira equilibrio',
  heroItalicWord: 'The Glow',
  heroDescription: 'Tratamientos faciales y corporales personalizados, aparatología estética avanzada y una boutique curada de productos dermatológicos premium.',
  whatsappNumber: '5493790000000',
  instagramUrl: 'https://instagram.com/raquelpons_estetica',
  address: 'Córdoba, Argentina · Consultorio privado',
  openingHours: 'Atención con turno previo · Lunes a Viernes',
  aboutText: 'RAQUELPONS_ESTETICA nace desde una mirada integral del cuidado facial y corporal, combinando formación profesional, experiencia en estética avanzada y selección responsable de productos dermocosméticos.',
  trainingText: 'Formación profesional en España. Experiencia junto a referentes del sector en Barcelona.',
  experienceText: 'Licenciada en Kinesiología y Fisioterapia, con formación en dermocosmética, aparatología estética y cuidado integral de la piel.',
  legalText: 'La información publicada tiene fines informativos y no reemplaza una evaluación profesional personalizada.',
  showBeforeAfter: true,
  showTestimonials: true,
  enableProducts: true,
  enableAppointments: true,
}

async function getData() {
  try {
    const [settings, services, categories, products, productCategories, skinConcerns, testimonials, siteContent] =
      await Promise.all([
        prisma.businessSettings.findFirst(),
        prisma.service.findMany({
          where: { active: true },
          include: { category: true },
          orderBy: { sortOrder: 'asc' },
        }),
        prisma.serviceCategory.findMany({
          where: { active: true },
          orderBy: { sortOrder: 'asc' },
        }),
        prisma.product.findMany({
          where: { active: true },
          include: { category: true, skinConcern: true },
          orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }],
        }),
        prisma.productCategory.findMany({
          where: { active: true },
          orderBy: { sortOrder: 'asc' },
        }),
        prisma.skinConcern.findMany({
          where: { active: true },
          orderBy: { sortOrder: 'asc' },
        }),
        prisma.testimonial.findMany({
          where: { active: true },
          orderBy: { sortOrder: 'asc' },
        }),
        prisma.siteContent.findMany({
          orderBy: [{ section: 'asc' }, { sortOrder: 'asc' }],
        }),
      ])

    // Crear contentMap para fácil acceso por key
    const contentMap: Record<string, string> = {}
    siteContent.forEach(item => {
      contentMap[item.key] = item.value
    })

    return {
      settings: settings || fallbackSettings,
      services,
      categories,
      products,
      productCategories,
      skinConcerns,
      testimonials,
      contentMap,
    }
  } catch {
    // Fallback si no hay base de datos conectada
    return {
      settings: fallbackSettings,
      services: [],
      categories: [],
      products: [],
      productCategories: [],
      skinConcerns: [],
      testimonials: [],
      contentMap: {},
    }
  }
}

export default async function HomePage() {
  const { settings, services, categories, products, productCategories, skinConcerns, testimonials, contentMap } =
    await getData()

  return (
    <>
      <Navbar whatsapp={settings.whatsappNumber} />

      <main>
        {/* Hero */}
        <HeroTheGlow settings={settings as BusinessSettings} />

        {/* Trust Badges */}
        <TrustBadges />

        {/* Sobre la profesional */}
        <AboutProfessional settings={settings as BusinessSettings} contentMap={contentMap} />

        {/* Autoridad científica */}
        <ScientificAuthoritySection settings={settings as BusinessSettings} />

        {/* Tratamientos */}
        <TreatmentMenu
          services={services as Service[]}
          categories={categories as ServiceCategory[]}
          whatsapp={settings.whatsappNumber}
          brandName={settings.brandName}
          contentMap={contentMap}
        />

        {/* Boutique productos */}
        {settings.enableProducts && (
          <CuratedBoutique
            products={products as Product[]}
            categories={productCategories as ProductCategory[]}
            skinConcerns={skinConcerns as SkinConcern[]}
            whatsapp={settings.whatsappNumber}
            brandName={settings.brandName}
            contentMap={contentMap}
          />
        )}

        {/* Testimonios */}
        {settings.showTestimonials && testimonials.length > 0 && (
          <TestimonialsSection testimonials={testimonials as Testimonial[]} />
        )}

        {/* Diagnóstico / Turnos */}
        {settings.enableAppointments && (
          <section id="diagnostico" className="section-padding bg-nude/20">
            <div className="container-premium">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div>
                  <p className="section-label mb-6">{contentMap['diagnosis_section_label'] || 'Turnos'}</p>
                  <h2 className="font-display text-4xl md:text-5xl text-anthracite mb-4 leading-tight">
                    {contentMap['diagnosis_title_line_1'] || 'Reserva de'}
                    <br />
                    <em className="text-elegantBrown">{contentMap['diagnosis_title_line_2'] || 'Diagnóstico Facial'}</em>
                  </h2>
                  <div className="w-16 h-px bg-champagne mb-6" />
                  <p className="font-sans text-base text-anthracite/60 leading-relaxed max-w-sm">
                    {contentMap['diagnosis_description'] || 'Una evaluación personalizada para determinar el protocolo más adecuado para tu piel, tus objetivos y tu momento.'}
                  </p>
                  <div className="mt-8 space-y-3">
                    {[
                      contentMap['diagnosis_bullet_1'] || 'Diagnóstico facial personalizado',
                      contentMap['diagnosis_bullet_2'] || 'Selección de tratamiento adecuado',
                      contentMap['diagnosis_bullet_3'] || 'Plan de cuidado domiciliario',
                      contentMap['diagnosis_bullet_4'] || 'Seguimiento y acompañamiento'
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm font-sans text-anthracite/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-champagne" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card-premium p-8">
                  <AppointmentForm
                    services={services as Service[]}
                    whatsapp={settings.whatsappNumber}
                    brandName={settings.brandName}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contacto y mapa */}
        <ContactSection settings={settings as BusinessSettings} contentMap={contentMap} />
      </main>

      <PremiumFooter settings={settings as BusinessSettings} contentMap={contentMap} />
      <FloatingWhatsApp whatsappNumber={settings.whatsappNumber} />
    </>
  )
}
