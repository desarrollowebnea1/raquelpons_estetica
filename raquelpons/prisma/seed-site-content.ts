import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const items = [
  { section: 'formacion', key: 'about_section_label', label: 'Etiqueta sección formación', value: 'La profesional', sortOrder: 1 },
  { section: 'formacion', key: 'about_title_line_1', label: 'Título formación línea 1', value: 'Un enfoque integral', sortOrder: 2 },
  { section: 'formacion', key: 'about_title_line_2', label: 'Título formación línea 2', value: 'del cuidado de la piel', sortOrder: 3 },
  { section: 'formacion', key: 'about_card_location', label: 'Ubicación tarjeta formación', value: 'Córdoba, Argentina', sortOrder: 4 },
  { section: 'formacion', key: 'about_card_title', label: 'Título tarjeta formación', value: 'Estética Profesional & Cosmeatria', sortOrder: 5 },
  { section: 'formacion', key: 'about_card_subtitle', label: 'Subtítulo tarjeta formación', value: 'Formación Internacional · España', sortOrder: 6 },
  { section: 'formacion', key: 'about_badge_label', label: 'Etiqueta badge formación', value: 'Consulta con', sortOrder: 7 },
  { section: 'formacion', key: 'about_badge_name', label: 'Nombre badge formación', value: 'María Padilla', sortOrder: 8 },
  { section: 'formacion', key: 'about_badge_location', label: 'Ubicación badge formación', value: 'Barcelona, España', sortOrder: 9 },

  { section: 'tratamientos', key: 'treatments_section_label', label: 'Etiqueta sección tratamientos', value: 'Tratamientos', sortOrder: 10 },
  { section: 'tratamientos', key: 'treatments_title_line_1', label: 'Título tratamientos línea 1', value: 'The Treatment', sortOrder: 11 },
  { section: 'tratamientos', key: 'treatments_title_line_2', label: 'Título tratamientos línea 2', value: 'Menu', sortOrder: 12 },
  { section: 'tratamientos', key: 'treatments_description', label: 'Descripción tratamientos', value: 'Cada protocolo se selecciona según evaluación profesional, tipo de piel, objetivo estético y necesidad individual.', sortOrder: 13 },

  { section: 'diagnostico', key: 'diagnosis_section_label', label: 'Etiqueta diagnóstico', value: 'Turnos', sortOrder: 14 },
  { section: 'diagnostico', key: 'diagnosis_title_line_1', label: 'Título diagnóstico línea 1', value: 'Reserva de', sortOrder: 15 },
  { section: 'diagnostico', key: 'diagnosis_title_line_2', label: 'Título diagnóstico línea 2', value: 'Diagnóstico Facial', sortOrder: 16 },
  { section: 'diagnostico', key: 'diagnosis_description', label: 'Descripción diagnóstico', value: 'Una evaluación personalizada para determinar el protocolo más adecuado para tu piel, tus objetivos y tu momento.', sortOrder: 17 },
  { section: 'diagnostico', key: 'diagnosis_bullet_1', label: 'Punto diagnóstico 1', value: 'Diagnóstico facial personalizado', sortOrder: 18 },
  { section: 'diagnostico', key: 'diagnosis_bullet_2', label: 'Punto diagnóstico 2', value: 'Selección de tratamiento adecuado', sortOrder: 19 },
  { section: 'diagnostico', key: 'diagnosis_bullet_3', label: 'Punto diagnóstico 3', value: 'Plan de cuidado domiciliario', sortOrder: 20 },
  { section: 'diagnostico', key: 'diagnosis_bullet_4', label: 'Punto diagnóstico 4', value: 'Seguimiento y acompañamiento', sortOrder: 21 },

  { section: 'boutique', key: 'boutique_section_label', label: 'Etiqueta sección boutique', value: 'Boutique', sortOrder: 22 },
  { section: 'boutique', key: 'boutique_title_line_1', label: 'Título boutique línea 1', value: 'La Boutique', sortOrder: 23 },
  { section: 'boutique', key: 'boutique_title_line_2', label: 'Título boutique línea 2', value: 'Curada', sortOrder: 24 },
  { section: 'boutique', key: 'boutique_description', label: 'Descripción boutique', value: 'Selección responsable de marcas dermatológicas y productos premium para potenciar resultados en el cuidado cotidiano.', sortOrder: 25 },

  { section: 'contacto', key: 'contact_section_label', label: 'Etiqueta sección contacto', value: 'Contacto', sortOrder: 26 },
  { section: 'contacto', key: 'contact_title_line_1', label: 'Título contacto línea 1', value: 'Escribinos o', sortOrder: 27 },
  { section: 'contacto', key: 'contact_title_line_2', label: 'Título contacto línea 2', value: 'reservá tu cita', sortOrder: 28 },
  { section: 'contacto', key: 'contact_description', label: 'Descripción contacto', value: 'Consultorio privado en Córdoba con atención personalized y evaluación profesional integral.', sortOrder: 29 },

  { section: 'footer', key: 'footer_legal_text', label: 'Texto legal footer', value: 'La información publicada tiene fines informativos y no reemplaza una consulta profesional personalizada. © RAQUELPONS_ESTETICA | Todos los derechos reservados.', sortOrder: 30 },
]

async function main() {
  for (const item of items) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: item,
      create: item,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('SiteContent seed listo')
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
