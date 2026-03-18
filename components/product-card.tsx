"use client"

import { ShoppingCart, Star, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Product {
  id: string
  name: string
  brand: string
  price: number
  category: string
  image_url?: string
  description?: string
  attributes?: Record<string, string | number>
  rating?: number
  stock_qty?: number
}

interface ProductCardProps {
  product: Product
  onClick: (product: Product) => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <button
      onClick={() => onClick(product)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/60 p-3 text-left transition-all duration-300 hover:border-cyan-500/30 hover:bg-card hover:shadow-xl hover:shadow-cyan-500/5"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-secondary/50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-cyan-500/5 to-sky-500/5">
            <Zap className="h-8 w-8 text-cyan-500/20" />
          </div>
        )}
        
        {/* Rating Badge */}
        {product.rating && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-black/40 px-2 py-1 backdrop-blur-md">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-bold text-white">{product.rating}</span>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500/80">
            {product.brand}
          </span>
          {product.stock_qty !== undefined && product.stock_qty < 10 && (
            <span className="text-[10px] font-medium text-amber-500">
              Low Stock
            </span>
          )}
        </div>
        
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-cyan-400 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-base font-bold text-foreground">
            $ {product.price.toLocaleString("id-ID")}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500 transition-colors group-hover:bg-cyan-500 group-hover:text-white">
            <ShoppingCart className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Hover visual accent */}
      <div className="absolute left-0 top-0 h-1 w-0 bg-linear-to-r from-cyan-400 to-sky-500 transition-all duration-300 group-hover:w-full" />
    </button>
  )
}
