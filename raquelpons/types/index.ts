// types/index.ts

export type Role = 'ADMIN' | 'SUPERADMIN'
export type AppointmentStatus = 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'CANCELLED' | 'FINISHED'
export type InquiryStatus = 'NEW' | 'CONTACTED' | 'PAYMENT_PENDING' | 'DELIVERED' | 'CANCELLED'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  createdAt: Date
  updatedAt: Date
}

export interface BusinessSettings {
  id: string
  brandName: string
  slogan: string
  heroTitle: string
  heroItalicWord: string
  heroDescription: string
  logoUrl?: string | null
  heroImageUrl?: string | null
  heroVideoUrl?: string | null
  whatsappNumber: string
  instagramUrl: string
  facebookUrl?: string | null
  address: string
  googleMapsUrl?: string | null
  mapEmbedUrl?: string | null
  openingHours: string
  aboutText: string
  trainingText: string
  experienceText: string
  legalText: string
  ogImageUrl?: string | null
  showBeforeAfter: boolean
  showTestimonials: boolean
  enableProducts: boolean
  enableAppointments: boolean
}

export interface ServiceCategory {
  id: string
  name: string
  slug: string
  active: boolean
  sortOrder: number
}

export interface Service {
  id: string
  name: string
  slug: string
  objective?: string | null
  sensation?: string | null
  treatmentTime?: string | null
  shortDescription?: string | null
  longDescription?: string | null
  benefits?: string | null
  contraindications?: string | null
  duration?: string | null
  price?: number | null
  imageUrl?: string | null
  active: boolean
  featured: boolean
  sortOrder: number
  categoryId: string
  category?: ServiceCategory
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  active: boolean
  sortOrder: number
}

export interface SkinConcern {
  id: string
  name: string
  slug: string
  active: boolean
  sortOrder: number
}

export interface Product {
  id: string
  name: string
  slug: string
  brand?: string | null
  laboratory?: string | null
  description?: string | null
  price?: number | null
  stock?: number | null
  imageUrl?: string | null
  usage?: string | null
  warnings?: string | null
  active: boolean
  featured: boolean
  sortOrder: number
  categoryId?: string | null
  category?: ProductCategory
  skinConcernId?: string | null
  skinConcern?: SkinConcern
}

export interface AppointmentRequest {
  id: string
  customerName: string
  whatsapp: string
  serviceId?: string | null
  serviceName: string
  preferredDay?: string | null
  preferredTime?: string | null
  message?: string | null
  whatsappMessage?: string | null
  status: AppointmentStatus
  createdAt: Date
  updatedAt: Date
}

export interface ProductInquiryItem {
  id: string
  inquiryId: string
  productId?: string | null
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  product?: Product
}

export interface ProductInquiry {
  id: string
  customerName: string
  whatsapp: string
  message?: string | null
  subtotal: number
  whatsappMessage?: string | null
  status: InquiryStatus
  items: ProductInquiryItem[]
  createdAt: Date
  updatedAt: Date
}

export interface Testimonial {
  id: string
  customerName: string
  text: string
  serviceName?: string | null
  active: boolean
  sortOrder: number
}

export interface BeforeAfter {
  id: string
  title: string
  serviceName?: string | null
  beforeImageUrl?: string | null
  afterImageUrl?: string | null
  description?: string | null
  active: boolean
  sortOrder: number
}

// Cart / Inquiry cart types
export interface CartItem {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

// Dashboard stats
export interface DashboardStats {
  totalServices: number
  activeServices: number
  totalProducts: number
  activeProducts: number
  featuredProducts: number
  totalAppointments: number
  newAppointments: number
  totalInquiries: number
  newInquiries: number
  whatsappConfigured: boolean
}
