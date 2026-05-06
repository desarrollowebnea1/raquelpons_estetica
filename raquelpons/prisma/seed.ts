// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // ─── Usuario admin ───────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('admin123456', 12)
  await prisma.user.upsert({
    where: { email: 'admin@raquelponsestetica.com' },
    update: {},
    create: {
      name: 'Raquel Pons',
      email: 'admin@raquelponsestetica.com',
      passwordHash,
      role: Role.SUPERADMIN,
    },
  })

  // ─── Business Settings ────────────────────────────────────────────────────────
  const settingsCount = await prisma.businessSettings.count()
  if (settingsCount === 0) {
    await prisma.businessSettings.create({
      data: {
        brandName: 'RAQUELPONS_ESTETICA',
        slogan: 'Dermocosmética profesional y estética integral',
        heroTitle: 'Dermocosmética profesional para una piel que respira equilibrio',
        heroItalicWord: 'The Glow',
        heroDescription:
          'Tratamientos faciales y corporales personalizados, aparatología estética avanzada y una boutique curada de productos dermatológicos premium.',
        whatsappNumber: '5493790000000',
        instagramUrl: 'https://instagram.com/raquelpons_estetica',
        facebookUrl: '',
        address: 'Córdoba, Argentina · Consultorio privado',
        openingHours: 'Atención con turno previo · Lunes a Viernes',
        aboutText:
          'RAQUELPONS_ESTETICA nace desde una mirada integral del cuidado facial y corporal, combinando formación profesional, experiencia en estética avanzada y selección responsable de productos dermocosméticos. Su enfoque une conocimiento en kinesiología, fisioterapia, aparatología estética y dermocosmética para acompañar cada tratamiento de manera personalizada.',
        trainingText:
          'Formación profesional en España. Experiencia junto a referentes del sector en Barcelona.',
        experienceText:
          'Licenciada en Kinesiología y Fisioterapia, con formación en dermocosmética, aparatología estética y cuidado integral de la piel.',
        legalText:
          'La información publicada tiene fines informativos y no reemplaza una evaluación profesional personalizada.',
        showBeforeAfter: true,
        showTestimonials: true,
        enableProducts: true,
        enableAppointments: true,
      },
    })
  }

  // ─── Categorías de servicios ──────────────────────────────────────────────────
  const serviceCategories = [
    { name: 'Tratamientos faciales', slug: 'tratamientos-faciales', sortOrder: 1 },
    { name: 'Tratamientos corporales', slug: 'tratamientos-corporales', sortOrder: 2 },
    { name: 'Aparatología estética', slug: 'aparatologia-estetica', sortOrder: 3 },
    { name: 'Cejas y mirada', slug: 'cejas-y-mirada', sortOrder: 4 },
    { name: 'Bienestar complementario', slug: 'bienestar-complementario', sortOrder: 5 },
  ]

  const createdServiceCategories: Record<string, string> = {}
  for (const cat of serviceCategories) {
    const created = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    createdServiceCategories[cat.slug] = created.id
  }

  // ─── Servicios ────────────────────────────────────────────────────────────────
  const services = [
    {
      name: 'Maderoterapia facial',
      slug: 'maderoterapia-facial',
      categorySlug: 'tratamientos-faciales',
      objective: 'Estimular circulación, drenaje y tonicidad facial.',
      sensation: 'Masaje activo, profundo y relajante.',
      treatmentTime: 'Consultar',
      shortDescription: 'Técnica manual con instrumentos de madera para estimular circulación y drenaje.',
      longDescription:
        'Técnica manual con instrumentos de madera diseñada para estimular la circulación, favorecer el drenaje y acompañar la tonicidad del rostro. Los resultados pueden variar según cada persona.',
      benefits: 'Mejora circulación · Favorece drenaje · Acompaña tonicidad facial',
      featured: true,
      sortOrder: 1,
    },
    {
      name: 'Higiene facial profunda',
      slug: 'higiene-facial-profunda',
      categorySlug: 'tratamientos-faciales',
      objective: 'Oxigenar, limpiar y preparar la piel.',
      sensation: 'Limpieza profunda y sensación de frescura.',
      treatmentTime: 'Consultar',
      shortDescription: 'Limpieza profesional orientada a retirar impurezas y mejorar la oxigenación.',
      longDescription:
        'Limpieza profesional orientada a retirar impurezas, mejorar la oxigenación de la piel y preparar el rostro para otros tratamientos. Según evaluación profesional.',
      benefits: 'Poros despejados · Piel oxigenada · Preparación para tratamientos',
      featured: true,
      sortOrder: 2,
    },
    {
      name: 'Peeling',
      slug: 'peeling',
      categorySlug: 'tratamientos-faciales',
      objective: 'Renovar textura y luminosidad.',
      sensation: 'Renovación progresiva.',
      treatmentTime: 'Consultar',
      shortDescription: 'Tratamiento de renovación superficial que ayuda a mejorar la textura y luminosidad.',
      longDescription:
        'Tratamiento de renovación superficial que ayuda a mejorar la textura, luminosidad y aspecto general de la piel. Los resultados pueden variar según cada persona y tipo de piel.',
      benefits: 'Mejora textura · Aporta luminosidad · Renueva aspecto general',
      sortOrder: 3,
    },
    {
      name: 'Peeling químico',
      slug: 'peeling-quimico',
      categorySlug: 'tratamientos-faciales',
      objective: 'Renovación cutánea con activos específicos.',
      sensation: 'Puede variar según piel y protocolo.',
      treatmentTime: 'Consultar',
      shortDescription: 'Procedimiento profesional con activos específicos para renovar y mejorar la piel.',
      longDescription:
        'Procedimiento profesional con activos específicos que contribuye a renovar la piel, mejorar manchas superficiales, textura y luminosidad. Según evaluación profesional previa.',
      benefits: 'Mejora manchas superficiales · Renueva textura · Aporta luminosidad',
      sortOrder: 4,
    },
    {
      name: 'Peeling enzimático con vitaminas',
      slug: 'peeling-enzimatico-vitaminas',
      categorySlug: 'tratamientos-faciales',
      objective: 'Renovación suave y luminosidad.',
      sensation: 'Suave, confortable y progresiva.',
      treatmentTime: 'Consultar',
      shortDescription: 'Tratamiento suave con enzimas y vitaminas que favorece la renovación cutánea.',
      longDescription:
        'Tratamiento suave con enzimas y vitaminas que favorece la renovación cutánea y aporta luminosidad. Indicado para pieles sensibles o que buscan una renovación progresiva.',
      benefits: 'Renovación suave · Luminosidad · Compatible con piel sensible',
      sortOrder: 5,
    },
    {
      name: 'Dermapen / Microneedling',
      slug: 'dermapen-microneedling',
      categorySlug: 'aparatologia-estetica',
      objective: 'Estimular renovación cutánea y colágeno.',
      sensation: 'Microestimulación controlada.',
      treatmentTime: 'Consultar',
      shortDescription: 'Tratamiento con microagujas que ayuda a estimular la renovación cutánea.',
      longDescription:
        'Tratamiento con microagujas que ayuda a estimular la renovación cutánea y la producción natural de colágeno. Se realiza según evaluación profesional previa.',
      benefits: 'Estimula colágeno · Mejora textura · Renovación cutánea',
      featured: true,
      sortOrder: 6,
    },
    {
      name: 'Radiofrecuencia',
      slug: 'radiofrecuencia',
      categorySlug: 'aparatologia-estetica',
      objective: 'Estimular firmeza, colágeno y elastina.',
      sensation: 'Calor controlado y confortable.',
      treatmentTime: 'Consultar',
      shortDescription: 'Aparatología estética que ayuda a estimular colágeno y acompañar la firmeza.',
      longDescription:
        'Aparatología estética que ayuda a estimular colágeno y elastina, acompañando la firmeza y tonicidad de la piel. Los resultados pueden variar según cada persona.',
      benefits: 'Estimula colágeno · Acompaña firmeza · Mejora tonicidad',
      featured: true,
      sortOrder: 7,
    },
    {
      name: 'Punta de diamante',
      slug: 'punta-de-diamante',
      categorySlug: 'aparatologia-estetica',
      objective: 'Mejorar textura, suavidad y luminosidad.',
      sensation: 'Exfoliación mecánica superficial.',
      treatmentTime: 'Consultar',
      shortDescription: 'Microdermoabrasión superficial que ayuda a mejorar textura y luminosidad.',
      longDescription:
        'Microdermoabrasión superficial que ayuda a mejorar textura, suavidad y luminosidad del rostro. Tratamiento no invasivo con resultados progresivos.',
      benefits: 'Mejora textura · Aporta suavidad · Luminosidad visible',
      sortOrder: 8,
    },
    {
      name: 'Espátula ultrasónica',
      slug: 'espatula-ultrasonica',
      categorySlug: 'aparatologia-estetica',
      objective: 'Limpieza profunda y preparación de la piel.',
      sensation: 'Suave, fresca y no invasiva.',
      treatmentTime: 'Consultar',
      shortDescription: 'Herramienta de limpieza facial para retirar impurezas y preparar la piel.',
      longDescription:
        'Herramienta de limpieza facial que ayuda a retirar impurezas y mejorar la preparación de la piel mediante vibraciones ultrasónicas suaves.',
      benefits: 'Limpieza profunda · No invasivo · Prepara la piel',
      sortOrder: 9,
    },
    {
      name: 'HIFU',
      slug: 'hifu',
      categorySlug: 'aparatologia-estetica',
      objective: 'Acompañar firmeza y tensión cutánea.',
      sensation: 'Estimulación focalizada.',
      treatmentTime: 'Consultar',
      shortDescription: 'Tecnología estética focalizada que ayuda a tensar la piel y estimular colágeno.',
      longDescription:
        'Tecnología estética focalizada que ayuda a tensar la piel, acompañar la flacidez leve y estimular la producción de colágeno y elastina. Según evaluación profesional.',
      benefits: 'Acompaña tensión cutánea · Estimula colágeno · Sin cirugía',
      featured: true,
      sortOrder: 10,
    },
    {
      name: 'Micropigmentación de cejas',
      slug: 'micropigmentacion-cejas',
      categorySlug: 'cejas-y-mirada',
      objective: 'Definir y armonizar la mirada.',
      sensation: 'Procedimiento preciso con evaluación previa.',
      treatmentTime: 'Consultar',
      shortDescription: 'Diseño y pigmentación semipermanente de cejas para una apariencia más definida.',
      longDescription:
        'Diseño y pigmentación semipermanente de cejas para lograr una apariencia más definida, armónica y natural, según evaluación profesional previa.',
      benefits: 'Define la mirada · Armoniza el rostro · Resultado natural',
      featured: true,
      sortOrder: 11,
    },
    {
      name: 'Perfilado de cejas',
      slug: 'perfilado-de-cejas',
      categorySlug: 'cejas-y-mirada',
      objective: 'Armonizar expresión facial.',
      sensation: 'Servicio rápido, preciso y delicado.',
      treatmentTime: 'Consultar',
      shortDescription: 'Diseño personalizado de cejas para armonizar la expresión facial.',
      longDescription:
        'Diseño personalizado de cejas para armonizar la expresión facial y resaltar la mirada. Servicio rápido y preciso.',
      benefits: 'Armoniza expresión · Resalta la mirada · Diseño personalizado',
      sortOrder: 12,
    },
    {
      name: 'Auriculoterapia',
      slug: 'auriculoterapia',
      categorySlug: 'bienestar-complementario',
      objective: 'Acompañar bienestar general.',
      sensation: 'Técnica complementaria suave.',
      treatmentTime: 'Consultar',
      shortDescription: 'Técnica complementaria que trabaja puntos de la oreja para el bienestar.',
      longDescription:
        'Técnica complementaria que trabaja puntos específicos de la oreja para acompañar procesos de bienestar general. No reemplaza tratamiento médico.',
      benefits: 'Complementa bienestar · Técnica suave · Enfoque integral',
      sortOrder: 13,
    },
  ]

  for (const svc of services) {
    const { categorySlug, ...data } = svc
    await prisma.service.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        categoryId: createdServiceCategories[categorySlug],
      },
    })
  }

  // ─── Preocupaciones de piel ───────────────────────────────────────────────────
  const skinConcerns = [
    { name: 'Acné', slug: 'acne', sortOrder: 1 },
    { name: 'Rosácea', slug: 'rosacea', sortOrder: 2 },
    { name: 'Aging / Antiedad', slug: 'aging', sortOrder: 3 },
    { name: 'Hidratación', slug: 'hidratacion', sortOrder: 4 },
    { name: 'Piel sensible', slug: 'piel-sensible', sortOrder: 5 },
    { name: 'Manchas', slug: 'manchas', sortOrder: 6 },
    { name: 'Limpieza', slug: 'limpieza', sortOrder: 7 },
    { name: 'Protección solar', slug: 'proteccion-solar', sortOrder: 8 },
    { name: 'Post tratamiento', slug: 'post-tratamiento', sortOrder: 9 },
    { name: 'Firmeza', slug: 'firmeza', sortOrder: 10 },
    { name: 'Cuidado corporal', slug: 'cuidado-corporal', sortOrder: 11 },
  ]

  const createdSkinConcerns: Record<string, string> = {}
  for (const sc of skinConcerns) {
    const created = await prisma.skinConcern.upsert({
      where: { slug: sc.slug },
      update: {},
      create: sc,
    })
    createdSkinConcerns[sc.slug] = created.id
  }

  // ─── Categorías de productos ──────────────────────────────────────────────────
  const productCategories = [
    { name: 'Suplementos nutricionales biológicos', slug: 'suplementos-biologicos', sortOrder: 1 },
    { name: 'Peptonas biológicas', slug: 'peptonas-biologicas', sortOrder: 2 },
    { name: 'Cosmeceúticos', slug: 'cosmeceuticos', sortOrder: 3 },
    { name: 'Cuidado facial', slug: 'cuidado-facial', sortOrder: 4 },
    { name: 'Cuidado corporal', slug: 'cuidado-corporal', sortOrder: 5 },
    { name: 'Protectores solares', slug: 'protectores-solares', sortOrder: 6 },
    { name: 'Máscaras faciales', slug: 'mascaras-faciales', sortOrder: 7 },
    { name: 'Kits de cuidado', slug: 'kits-de-cuidado', sortOrder: 8 },
    { name: 'Piel sensible', slug: 'piel-sensible', sortOrder: 9 },
    { name: 'Antiage', slug: 'antiage', sortOrder: 10 },
    { name: 'Hidratación', slug: 'hidratacion', sortOrder: 11 },
    { name: 'Limpieza facial', slug: 'limpieza-facial', sortOrder: 12 },
    { name: 'Acné y piel grasa', slug: 'acne-piel-grasa', sortOrder: 13 },
    { name: 'Productos post tratamiento', slug: 'post-tratamiento', sortOrder: 14 },
  ]

  const createdProductCategories: Record<string, string> = {}
  for (const cat of productCategories) {
    const created = await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    createdProductCategories[cat.slug] = created.id
  }

  // ─── Productos demo ───────────────────────────────────────────────────────────
  const products = [
    {
      name: 'Suplemento Nutricional Vitalil',
      slug: 'suplemento-nutricional-vitalil',
      brand: 'Vitalil',
      laboratory: 'Vitalil',
      description: 'Suplemento nutricional biológico formulado para acompañar el bienestar general de la piel desde adentro. Composición a base de activos naturales seleccionados.',
      price: null,
      categorySlug: 'suplementos-biologicos',
      skinConcernSlug: 'hidratacion',
      featured: true,
      sortOrder: 1,
    },
    {
      name: 'Terapia Peptona Biológica Peptonum',
      slug: 'terapia-peptona-biologica-peptonum',
      brand: 'Peptonum',
      laboratory: 'Peptonum',
      description: 'Peptonas biológicas de uso profesional. Fórmula orientada a acompañar procesos de recuperación y bienestar cutáneo según evaluación profesional.',
      price: null,
      categorySlug: 'peptonas-biologicas',
      skinConcernSlug: 'post-tratamiento',
      featured: true,
      sortOrder: 2,
    },
    {
      name: 'Hidratante Facial Lidherma',
      slug: 'hidratante-facial-lidherma',
      brand: 'Lidherma',
      laboratory: 'Lidherma',
      description: 'Crema hidratante facial con activos que favorecen la hidratación profunda y el equilibrio natural de la piel. Fórmula dermatológicamente desarrollada.',
      price: null,
      categorySlug: 'cuidado-facial',
      skinConcernSlug: 'hidratacion',
      featured: false,
      sortOrder: 3,
    },
    {
      name: 'Protector Solar Lidherma SPF50',
      slug: 'protector-solar-lidherma-spf50',
      brand: 'Lidherma',
      laboratory: 'Lidherma',
      description: 'Protector solar de amplio espectro con FPS50. Textura ligera, no comedogénica, apta para uso diario. Favorece la protección de la piel frente a la radiación solar.',
      price: null,
      categorySlug: 'protectores-solares',
      skinConcernSlug: 'proteccion-solar',
      featured: true,
      sortOrder: 4,
    },
    {
      name: 'Serum Vitamina C Exel',
      slug: 'serum-vitamina-c-exel',
      brand: 'Exel',
      laboratory: 'Exel',
      description: 'Sérum con Vitamina C estabilizada que contribuye a la luminosidad y uniformidad del tono de piel. Fórmula de uso profesional y domiciliario.',
      price: null,
      categorySlug: 'cosmeceuticos',
      skinConcernSlug: 'manchas',
      featured: false,
      sortOrder: 5,
    },
    {
      name: 'Gel Limpiador Facial Prodermic',
      slug: 'gel-limpiador-facial-prodermic',
      brand: 'Prodermic',
      laboratory: 'Prodermic',
      description: 'Gel limpiador facial formulado para remover impurezas sin alterar el manto ácido de la piel. Apto para uso diario en pieles normales a grasas.',
      price: null,
      categorySlug: 'limpieza-facial',
      skinConcernSlug: 'limpieza',
      featured: false,
      sortOrder: 6,
    },
    {
      name: 'Crema Antiage Hidraet',
      slug: 'crema-antiage-hidraet',
      brand: 'Hidraet',
      laboratory: 'Hidraet',
      description: 'Crema antiedad que contribuye a la hidratación profunda y acompaña la firmeza de la piel. Activos orientados al cuidado del skin aging.',
      price: null,
      categorySlug: 'antiage',
      skinConcernSlug: 'aging',
      featured: false,
      sortOrder: 7,
    },
    {
      name: 'Mascarilla Biodance',
      slug: 'mascarilla-biodance',
      brand: 'Biodance',
      laboratory: 'Biodance',
      description: 'Mascarilla facial con activos hidratantes y calmantes. Fórmula de uso periódico para acompañar la hidratación y suavidad de la piel.',
      price: null,
      categorySlug: 'mascaras-faciales',
      skinConcernSlug: 'hidratacion',
      featured: false,
      sortOrder: 8,
    },
    {
      name: 'Kit Inicio Cuidado Facial',
      slug: 'kit-inicio-cuidado-facial',
      brand: 'Prodermic',
      laboratory: 'Prodermic',
      description: 'Kit introductorio curado con productos seleccionados para comenzar una rutina de cuidado facial básica y efectiva. Contenido según disponibilidad.',
      price: null,
      categorySlug: 'kits-de-cuidado',
      skinConcernSlug: 'hidratacion',
      featured: true,
      sortOrder: 9,
    },
    {
      name: 'Crema Piel Sensible Medical Anche',
      slug: 'crema-piel-sensible-medical-anche',
      brand: 'Medical Anche',
      laboratory: 'Medical Anche',
      description: 'Crema formulada para pieles sensibles o reactivas. Ayuda a calmar, hidratary acompañar la barrera cutánea. Sin fragancia.',
      price: null,
      categorySlug: 'piel-sensible',
      skinConcernSlug: 'piel-sensible',
      featured: false,
      sortOrder: 10,
    },
    {
      name: 'Sérum Reparador Post Tratamiento Skin Lab',
      slug: 'serum-reparador-post-tratamiento',
      brand: 'Skin Lab',
      laboratory: 'Skin Lab',
      description: 'Sérum orientado al cuidado de la piel tras tratamientos estéticos. Contribuye a calmar, hidratar y acompañar la recuperación cutánea.',
      price: null,
      categorySlug: 'post-tratamiento',
      skinConcernSlug: 'post-tratamiento',
      featured: false,
      sortOrder: 11,
    },
    {
      name: 'Suplemento Key Elements Biológico',
      slug: 'suplemento-key-elements',
      brand: 'Key Elements',
      laboratory: 'Key Elements',
      description: 'Suplemento nutricional biológico de laboratorio especializado. Fórmula orientada al bienestar general y el cuidado desde adentro.',
      price: null,
      categorySlug: 'suplementos-biologicos',
      skinConcernSlug: 'firmeza',
      featured: false,
      sortOrder: 12,
    },
  ]

  for (const prod of products) {
    const { categorySlug, skinConcernSlug, ...data } = prod
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        categoryId: createdProductCategories[categorySlug],
        skinConcernId: createdSkinConcerns[skinConcernSlug],
      },
    })
  }

  // ─── Testimonios demo ─────────────────────────────────────────────────────────
  const testimonials = [
    {
      customerName: 'María L.',
      text: 'El resultado de la higiene facial fue increíble. La piel quedó súper limpia, hydratada y luminosa. Lo recomiendo completamente.',
      serviceName: 'Higiene facial profunda',
      active: true,
      sortOrder: 1,
    },
    {
      customerName: 'Valentina R.',
      text: 'Me hice la micropigmentación de cejas y quedé feliz. El diseño es muy natural y armonioso. Un trabajo muy prolijo y profesional.',
      serviceName: 'Micropigmentación de cejas',
      active: true,
      sortOrder: 2,
    },
    {
      customerName: 'Florencia M.',
      text: 'La sesión de radiofrecuencia fue relajante y se nota la diferencia en la firmeza de la piel. Muy buena atención, explicaron todo el procedimiento.',
      serviceName: 'Radiofrecuencia',
      active: true,
      sortOrder: 3,
    },
  ]

  for (const t of testimonials) {
    const count = await prisma.testimonial.count({ where: { customerName: t.customerName } })
    if (count === 0) {
      await prisma.testimonial.create({ data: t })
    }
  }

  console.log('✅ Seed completado exitosamente.')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
