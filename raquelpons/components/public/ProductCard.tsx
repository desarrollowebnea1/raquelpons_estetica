'use client'
// components/public/ProductCard.tsx
import { motion } from 'framer-motion'
import { ShoppingBag, MessageCircle, Package } from 'lucide-react'
import type { Product } from '@/types'
import { formatCurrencyARS } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  index: number
  onAddToCart: (product: Product) => void
  onWhatsApp: (product: Product) => void
}

export default function ProductCard({ product, index, onAddToCart, onWhatsApp }: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="card-premium overflow-hidden group flex flex-col"
    >
      {/* Imagen */}
      <div className="aspect-square bg-gradient-to-br from-nude/40 via-champagne/20 to-dustyRose/30 relative overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-3 opacity-30">
              <Package size={32} className="mx-auto text-elegantBrown" strokeWidth={1} />
              <p className="text-xs font-sans text-elegantBrown tracking-wide">
                {product.brand || 'Producto'}
              </p>
            </div>
          </div>
        )}
        
        {product.featured && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-sans tracking-wide uppercase bg-warmWhite/90 text-elegantBrown px-2 py-1 rounded-full backdrop-blur-sm">
              Seleccionado
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Marca */}
        {product.brand && (
          <p className="text-[10px] font-sans tracking-ultraspaced text-elegantBrown uppercase">
            {product.brand}
          </p>
        )}

        {/* Nombre */}
        <h3 className="font-display text-base text-anthracite leading-tight">
          {product.name}
        </h3>

        {/* Descripción */}
        {product.description && (
          <p className="font-sans text-xs text-anthracite/55 leading-relaxed flex-1 line-clamp-3">
            {product.description}
          </p>
        )}

        {/* Preocupación de piel */}
        {product.skinConcern && (
          <span className="text-[10px] font-sans tracking-wide text-anthracite/40 bg-nude/30 px-2 py-0.5 rounded-full w-fit">
            {product.skinConcern.name}
          </span>
        )}

        {/* Precio */}
        <div className="pt-3 border-t border-[rgba(44,44,44,0.06)] flex items-center justify-between">
          <span className="font-display text-lg text-anthracite">
            {formatCurrencyARS(product.price)}
          </span>
          {product.stock !== null && product.stock !== undefined && product.stock > 0 && (
            <span className="text-[10px] font-sans text-sage bg-sage/10 px-2 py-0.5 rounded-full">
              Disponible
            </span>
          )}
        </div>

        {/* CTAs */}
        <div className="flex gap-2">
          <button
            onClick={() => onWhatsApp(product)}
            className="btn-secondary text-xs flex-1 justify-center py-2.5 gap-1.5"
          >
            <MessageCircle size={12} />
            Consultar
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="btn-champagne text-xs flex-1 justify-center py-2.5 gap-1.5"
          >
            <ShoppingBag size={12} />
            Agregar
          </button>
        </div>
      </div>
    </motion.article>
  )
}
