"use client"

import { useState } from "react"
import { X, ShoppingCart, ShieldCheck, Truck, RefreshCw, Star } from "lucide-react"
import type { Product } from "./product-card"

interface ProductDetailModalProps {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product) => void
}

export function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "details">("overview")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in p-4 md:p-8">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-scale-in h-[90vh] md:h-[80vh] flex flex-col md:flex-row">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row w-full h-full overflow-hidden">
          {/* Left: Image Container */}
          <div className="relative w-full md:w-1/2 bg-secondary/30 shrink-0 h-[35vh] md:h-auto overflow-y-auto">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
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
                    <span className="text-[10px] font-semibold text-white text-center leading-tight whitespace-pre-line">
                      {product.warranty_months ? `${product.warranty_months} Months\nWarranty` : "Official\nWarranty"}
                    </span>
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
          <div className="flex w-full md:w-1/2 flex-1 flex-col p-6 md:p-8 overflow-hidden bg-card">
            <div className="flex-none pb-4">
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
            </div>

            {/* Sticky Tabs */}
            <div className="flex-none border-b border-border mb-4">
              <div className="flex gap-6 overflow-x-auto pb-px">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`whitespace-nowrap border-b-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeTab === "overview" ? "border-cyan-500 text-cyan-400" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Overview
                </button>
                {product.attributes || product.specs ? (
                  <button
                    onClick={() => setActiveTab("specs")}
                    className={`whitespace-nowrap border-b-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                      activeTab === "specs" ? "border-cyan-500 text-cyan-400" : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Specifications
                  </button>
                ) : null}
                {product["products detail"] ? (
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`whitespace-nowrap border-b-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                      activeTab === "details" ? "border-cyan-500 text-cyan-400" : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Details
                  </button>
                ) : null}
              </div>
            </div>

            {/* Scrollable Content Region */}
            <div className="flex-1 overflow-y-auto pr-2">
              {activeTab === "overview" && (
                <div className="animate-fade-in space-y-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                      Description
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {product.description || "No description available for this product."}
                    </p>
                  </div>
                  
                  {product.similarity && product.similarity.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                        Synonim
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.similarity.map((item, idx) => (
                          <span key={idx} className="rounded-lg bg-secondary/30 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "specs" && (product.attributes || product.specs) && (
                <div className="animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(product.attributes || product.specs || {}).map(([key, value]) => (
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

              {activeTab === "details" && product["products detail"] && (
                <div className="animate-fade-in space-y-3">
                  {Object.entries(product["products detail"]).map(([key, value]) => (
                    <div key={key} className="rounded-xl border border-border bg-secondary/30 px-4 py-3">
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="mt-1 block text-sm text-foreground leading-relaxed">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-none pt-6 mt-auto border-t border-border/50">
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
