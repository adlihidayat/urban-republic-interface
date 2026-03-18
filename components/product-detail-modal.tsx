"use client"

import { X, ShoppingCart, ShieldCheck, Truck, RefreshCw, Star } from "lucide-react"
import type { Product } from "./product-card"

interface ProductDetailModalProps {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product) => void
}

export function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative mx-4 w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-scale-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image Container */}
          <div className="relative aspect-square w-full bg-secondary/30 md:aspect-auto">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-cyan-500/5 to-sky-500/5">
                <span className="text-sm text-muted-foreground">No image available</span>
              </div>
            )}
            
            <div className="absolute bottom-6 left-6 right-6 flex gap-2">
                <div className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-black/40 px-3 py-2 backdrop-blur-md">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span className="text-[10px] font-semibold text-white">Official Warranty</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-black/40 px-3 py-2 backdrop-blur-md">
                    <Truck className="h-4 w-4 text-sky-400" />
                    <span className="text-[10px] font-semibold text-white">Free Shipping</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-black/40 px-3 py-2 backdrop-blur-md">
                    <RefreshCw className="h-4 w-4 text-cyan-400" />
                    <span className="text-[10px] font-semibold text-white">Easy Returns</span>
                </div>
            </div>
          </div>

          {/* Right: Details Container */}
          <div className="flex max-h-[80vh] flex-col overflow-y-auto p-8 md:max-h-none">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-500">
                {product.brand}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">• {product.category}</span>
            </div>

            <h2 className="mt-4 text-2xl font-bold text-foreground leading-tight">
              {product.name}
            </h2>

            <div className="mt-4 flex items-center gap-4">
              <span className="text-3xl font-bold text-foreground">
                $ {product.price.toLocaleString("id-ID")}
              </span>
              {product.rating && (
                <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-foreground">{product.rating}</span>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Description
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {product.description || "No description available for this product."}
              </p>
            </div>

            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Specifications
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="rounded-xl border border-border bg-secondary/30 px-4 py-3">
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="mt-1 block text-sm font-medium text-foreground">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto pt-10">
              <button 
                onClick={() => onAddToCart(product)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 to-sky-500 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/30 active:scale-[0.98]"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
