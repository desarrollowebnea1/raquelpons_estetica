'use client'
// components/public/CuratedBoutique.tsx
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, X, Plus, Minus, Send, CheckCircle } from 'lucide-react'
import type { Product, ProductCategory, SkinConcern, CartItem } from '@/types'
import ProductCard from './ProductCard'
import { formatCurrencyARS } from '@/lib/utils'
import { buildWhatsAppUrl, buildProductInquiryMessage, buildProductSingleMessage } from '@/lib/whatsapp'

interface CuratedBoutiqueProps {
  products: Product[]
  categories: ProductCategory[]
  skinConcerns: SkinConcern[]
  whatsapp: string
  brandName: string
  contentMap?: Record<string, string>
}

export default function CuratedBoutique({
  products,
  categories,
  skinConcerns,
  whatsapp,
  brandName,
  contentMap = {},
}: CuratedBoutiqueProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedConcern, setSelectedConcern] = useState<string>('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [cartForm, setCartForm] = useState({ name: '', phone: '', message: '' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const activeProducts = products.filter((p) => p.active)
  const filtered = activeProducts.filter((p) => {
    const catMatch = selectedCategory === 'all' || p.categoryId === selectedCategory
    const concernMatch = selectedConcern === 'all' || p.skinConcernId === selectedConcern
    return catMatch && concernMatch
  })

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    setCartOpen(true)
  }, [])

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id))
  }

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0)
    )
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  )

  const handleWhatsApp = (product: Product) => {
    const msg = buildProductSingleMessage({ brandName, productName: product.name })
    window.open(buildWhatsAppUrl(whatsapp, msg), '_blank')
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!cartForm.name.trim()) errs.name = 'El nombre es obligatorio'
    if (!cartForm.phone.trim()) errs.phone = 'El WhatsApp es obligatorio'
    if (cart.length === 0) errs.items = 'Debés agregar al menos un producto'
    return errs
  }

  const handleSendInquiry = async () => {
    const errs = validate()
    setFormErrors(errs)
    if (Object.keys(errs).length > 0) return
    setSubmitting(true)

    const items = cart.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      quantity: i.quantity,
      unitPrice: i.product.price || 0,
      totalPrice: (i.product.price || 0) * i.quantity,
    }))

    const whatsappMessage = buildProductInquiryMessage({
      brandName,
      customerName: cartForm.name,
      whatsapp: cartForm.phone,
      items: items.map((it) => ({ name: it.productName, quantity: it.quantity, price: it.unitPrice })),
      subtotal,
      message: cartForm.message || null,
    })

    try {
      await fetch('/api/product-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: cartForm.name,
          whatsapp: cartForm.phone,
          message: cartForm.message,
          items,
          subtotal,
          whatsappMessage,
        }),
      })
    } catch {}

    window.open(buildWhatsAppUrl(whatsapp, whatsappMessage), '_blank')
    setSubmitted(true)
    setSubmitting(false)
    setTimeout(() => {
      setSubmitted(false)
      setCart([])
      setCartOpen(false)
      setCartForm({ name: '', phone: '', message: '' })
    }, 3000)
  }

  return (
    <section id="boutique" className="section-padding bg-parchment">
      <div className="container-premium">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-label mb-4">{contentMap['boutique_section_label'] || 'Boutique'}</p>
          <h2 className="font-display text-4xl md:text-5xl text-anthracite mb-4">
            {contentMap['boutique_title_line_1'] || 'La Boutique'} {contentMap['boutique_title_line_2'] || 'Curada'}
          </h2>
          <p className="font-sans text-base text-anthracite/60 max-w-xl mx-auto">
            {contentMap['boutique_description'] || 'Una selección de productos, activos y suplementos elegidos con criterio profesional'}
          </p>
          <div className="divider-soft" />
        </motion.div>

        {/* Filtros */}
        <div className="mb-10 space-y-4">
          {/* Categorías */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-1.5 rounded-organic text-xs font-sans transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-anthracite text-warmWhite'
                  : 'bg-warmWhite border border-[rgba(44,44,44,0.12)] text-anthracite hover:border-champagne'
              }`}
            >
              Todas las categorías
            </button>
            {categories.filter((c) => c.active).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-organic text-xs font-sans transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-anthracite text-warmWhite'
                    : 'bg-warmWhite border border-[rgba(44,44,44,0.12)] text-anthracite hover:border-champagne'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Preocupaciones de piel */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedConcern('all')}
              className={`px-3 py-1 rounded-organic text-[11px] font-sans transition-all duration-300 ${
                selectedConcern === 'all'
                  ? 'bg-champagne text-anthracite'
                  : 'bg-nude/40 text-anthracite/70 hover:bg-nude'
              }`}
            >
              Todas las pieles
            </button>
            {skinConcerns.filter((sc) => sc.active).map((sc) => (
              <button
                key={sc.id}
                onClick={() => setSelectedConcern(sc.id)}
                className={`px-3 py-1 rounded-organic text-[11px] font-sans transition-all duration-300 ${
                  selectedConcern === sc.id
                    ? 'bg-champagne text-anthracite'
                    : 'bg-nude/40 text-anthracite/70 hover:bg-nude'
                }`}
              >
                {sc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Carrito flotante */}
        {cart.length > 0 && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setCartOpen(true)}
            className="fixed bottom-8 right-8 z-40 bg-anthracite text-warmWhite rounded-full p-4 shadow-medium flex items-center gap-2"
            aria-label="Ver consulta de productos"
          >
            <ShoppingBag size={20} />
            <span className="font-sans text-sm font-medium">{cart.length}</span>
          </motion.button>
        )}

        {/* Grid productos */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${selectedConcern}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onAddToCart={addToCart}
                onWhatsApp={handleWhatsApp}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="font-sans text-sm text-anthracite/40">
              No hay productos en esta selección.
            </p>
          </div>
        )}

        {/* Drawer carrito */}
        <AnimatePresence>
          {cartOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-anthracite/40 backdrop-blur-sm"
                onClick={() => setCartOpen(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-warmWhite shadow-medium flex flex-col"
              >
                {/* Header drawer */}
                <div className="flex items-center justify-between p-6 border-b border-[rgba(44,44,44,0.08)]">
                  <div>
                    <h3 className="font-display text-xl text-anthracite">Tu consulta</h3>
                    <p className="font-sans text-xs text-anthracite/50">Productos seleccionados</p>
                  </div>
                  <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-nude rounded-lg transition-colors">
                    <X size={18} className="text-anthracite" />
                  </button>
                </div>

                {submitted ? (
                  <div className="flex-1 flex items-center justify-center flex-col gap-4 p-8 text-center">
                    <CheckCircle size={48} className="text-sage" />
                    <h4 className="font-display text-2xl text-anthracite">¡Consulta enviada!</h4>
                    <p className="font-sans text-sm text-anthracite/60">
                      Tu consulta fue enviada por WhatsApp. Raquel se pondrá en contacto a la brevedad.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex gap-3 items-start p-3 bg-parchment rounded-soft"
                        >
                          <div className="flex-1">
                            <p className="font-sans text-sm font-medium text-anthracite leading-tight">
                              {item.product.name}
                            </p>
                            {item.product.brand && (
                              <p className="font-sans text-[11px] text-elegantBrown">{item.product.brand}</p>
                            )}
                            <p className="font-sans text-xs text-anthracite/50 mt-1">
                              {formatCurrencyARS(item.product.price)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQty(item.product.id, -1)}
                              className="w-6 h-6 rounded-full border border-[rgba(44,44,44,0.15)] flex items-center justify-center hover:bg-nude transition-colors"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="font-sans text-sm w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.product.id, 1)}
                              className="w-6 h-6 rounded-full border border-[rgba(44,44,44,0.15)] flex items-center justify-center hover:bg-nude transition-colors"
                            >
                              <Plus size={10} />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="ml-1 p-1 hover:text-red-400 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Subtotal */}
                      {subtotal > 0 && (
                        <div className="pt-3 border-t border-[rgba(44,44,44,0.08)] flex justify-between">
                          <span className="font-sans text-sm text-anthracite/60">Total estimado</span>
                          <span className="font-display text-lg text-anthracite">{formatCurrencyARS(subtotal)}</span>
                        </div>
                      )}

                      {/* Formulario */}
                      <div className="pt-4 space-y-3">
                        <div>
                          <label className="label-premium">Nombre *</label>
                          <input
                            type="text"
                            value={cartForm.name}
                            onChange={(e) => setCartForm({ ...cartForm, name: e.target.value })}
                            placeholder="Tu nombre"
                            className="input-premium"
                          />
                          {formErrors.name && (
                            <p className="text-xs text-red-400 mt-1">{formErrors.name}</p>
                          )}
                        </div>
                        <div>
                          <label className="label-premium">WhatsApp *</label>
                          <input
                            type="tel"
                            value={cartForm.phone}
                            onChange={(e) => setCartForm({ ...cartForm, phone: e.target.value })}
                            placeholder="Ej: 3794000000"
                            className="input-premium"
                          />
                          {formErrors.phone && (
                            <p className="text-xs text-red-400 mt-1">{formErrors.phone}</p>
                          )}
                        </div>
                        <div>
                          <label className="label-premium">Aclaración (opcional)</label>
                          <textarea
                            value={cartForm.message}
                            onChange={(e) => setCartForm({ ...cartForm, message: e.target.value })}
                            placeholder="Disponibilidad, forma de pago, etc."
                            rows={3}
                            className="input-premium resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-[rgba(44,44,44,0.08)]">
                      <button
                        onClick={handleSendInquiry}
                        disabled={submitting}
                        className="btn-whatsapp w-full justify-center text-sm"
                      >
                        <Send size={14} />
                        {submitting ? 'Enviando...' : 'Enviar consulta por WhatsApp'}
                      </button>
                      <p className="font-sans text-[10px] text-anthracite/40 text-center mt-3">
                        Los resultados pueden variar según cada persona.
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
