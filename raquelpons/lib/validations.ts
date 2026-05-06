// lib/validations.ts
import { z } from 'zod'

// ─── Appointment ─────────────────────────────────────────────────
export const appointmentSchema = z.object({
  customerName: z.string().min(2, 'El nombre es obligatorio'),
  whatsapp: z
    .string()
    .min(7, 'Ingresá un número de WhatsApp válido')
    .regex(/^[0-9+\s()-]+$/, 'Solo se permiten números y caracteres válidos'),
  serviceName: z.string().min(2, 'Seleccioná un servicio de interés'),
  preferredDay: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().max(500, 'El mensaje no puede superar los 500 caracteres').optional(),
})

export type AppointmentInput = z.infer<typeof appointmentSchema>

// ─── Product Inquiry ─────────────────────────────────────────────
export const productInquirySchema = z.object({
  customerName: z.string().min(2, 'El nombre es obligatorio'),
  whatsapp: z
    .string()
    .min(7, 'Ingresá un número de WhatsApp válido')
    .regex(/^[0-9+\s()-]+$/, 'Solo se permiten números y caracteres válidos'),
  message: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        productName: z.string(),
        quantity: z.number().int().min(1),
        unitPrice: z.number().min(0),
        totalPrice: z.number().min(0),
      })
    )
    .min(1, 'Debés agregar al menos un producto'),
  subtotal: z.number().min(0),
})

export type ProductInquiryInput = z.infer<typeof productInquirySchema>

// ─── Service ─────────────────────────────────────────────────────
export const serviceSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  slug: z.string().min(2, 'El slug es obligatorio').regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  categoryId: z.string().min(1, 'Seleccioná una categoría'),
  objective: z.string().optional(),
  sensation: z.string().optional(),
  treatmentTime: z.string().optional(),
  shortDescription: z.string().max(200).optional(),
  longDescription: z.string().optional(),
  benefits: z.string().optional(),
  contraindications: z.string().optional(),
  duration: z.string().optional(),
  price: z.number().min(0).nullable().optional(),
  imageUrl: z.string().url().optional().nullable(),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
})

export type ServiceInput = z.infer<typeof serviceSchema>

// ─── Product ─────────────────────────────────────────────────────
export const productSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  slug: z.string().min(2, 'El slug es obligatorio').regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  brand: z.string().optional(),
  laboratory: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0).nullable().optional(),
  stock: z.number().int().min(0).nullable().optional(),
  imageUrl: z.string().url().optional().nullable(),
  usage: z.string().optional(),
  warnings: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  skinConcernId: z.string().optional().nullable(),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
})

export type ProductInput = z.infer<typeof productSchema>

// ─── Admin login ─────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginInput = z.infer<typeof loginSchema>

// ─── Business Settings ───────────────────────────────────────────
export const settingsSchema = z.object({
  brandName: z.string().min(1),
  slogan: z.string().min(1),
  heroTitle: z.string().min(1),
  heroItalicWord: z.string().min(1),
  heroDescription: z.string().min(1),
  whatsappNumber: z.string().min(7).regex(/^[0-9+\s]+$/, 'Solo números y +'),
  instagramUrl: z.string().url().optional().or(z.literal('')),
  facebookUrl: z.string().url().optional().or(z.literal('')).nullable(),
  address: z.string().min(2),
  googleMapsUrl: z.string().url().optional().or(z.literal('')).nullable(),
  mapEmbedUrl: z.string().optional().nullable(),
  openingHours: z.string().min(1),
  aboutText: z.string().min(1),
  trainingText: z.string().optional(),
  experienceText: z.string().optional(),
  legalText: z.string().min(1),
  showBeforeAfter: z.boolean(),
  showTestimonials: z.boolean(),
  enableProducts: z.boolean(),
  enableAppointments: z.boolean(),
})

export type SettingsInput = z.infer<typeof settingsSchema>

// ─── Testimonial ─────────────────────────────────────────────────
export const testimonialSchema = z.object({
  customerName: z.string().min(2),
  text: z.string().min(10, 'El testimonio debe tener al menos 10 caracteres'),
  serviceName: z.string().optional(),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})

export type TestimonialInput = z.infer<typeof testimonialSchema>

// ─── Category ────────────────────────────────────────────────────
export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})

export type CategoryInput = z.infer<typeof categorySchema>
