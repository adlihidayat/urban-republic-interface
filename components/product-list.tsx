"use client"

import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, PackageOpen, X, ChevronDown, Check } from "lucide-react"
import { ProductCard, type Product } from "./product-card"
import { ProductDetailModal } from "./product-detail-modal"
import { cn } from "@/lib/utils"

const CATEGORIES = ["Accessories", "Camera", "Earphone", "Console", "Smartwatch"]

interface ProductListProps {
  products: Product[]
  isLoading: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategories: string[]
  setSelectedCategories: (categories: string[] | ((prev: string[]) => string[])) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  minRating: number
  setMinRating: (rating: number) => void
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  onAddToCart: (product: any) => void
}

export function ProductList({
  products,
  isLoading,
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  showFilters,
  setShowFilters,
  onAddToCart
}: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const filteredProducts = products.filter((p) => {
    // Search Query check
    const searchMatch = 
      (p.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (p.brand?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (p.category?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    
    // Category check
    const categoryMatch = 
      selectedCategories.length === 0 || 
      selectedCategories.some(cat => p.category?.toLowerCase() === cat.toLowerCase())
    
    // Price check
    const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1]
    
    // Rating check
    const ratingMatch = (p.rating || 0) >= minRating

    return searchMatch && categoryMatch && priceMatch && ratingMatch
  })

  if (isLoading) {
    return (
      <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto px-6 py-8 sm:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-4/5 animate-pulse rounded-2xl bg-secondary/30" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Product Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-4 backdrop-blur-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search gadgets, brands, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-input bg-secondary/50 py-2 pl-10 pr-4 text-sm transition-all focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/10"
          />
        </div>
        <div className="ml-4 flex items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 h-10 rounded-xl border transition-all duration-200",
              showFilters 
                ? "bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/20" 
                : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-xs font-semibold">Filters</span>
          </button>
          <div className="h-8 w-px bg-border mx-2" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 px-2 line-clamp-1">
            {filteredProducts.length} Results
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Filter Sidebar */}
        {showFilters && (
          <div className="absolute inset-y-0 left-0 z-40 w-72 border-r border-border bg-card/95 backdrop-blur-xl p-6 shadow-2xl animate-fade-in-right md:relative">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-foreground">Advanced Filters</h3>
              <button 
                onClick={() => {
                  setSelectedCategories([])
                  setPriceRange([0, 50000000])
                  setMinRating(0)
                }}
                className="text-[10px] font-bold uppercase tracking-wider text-cyan-500 hover:text-cyan-400"
              >
                Reset All
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {/* Category Filter */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-3 block">Category</span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => {
                    const isSelected = selectedCategories.includes(cat)
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategories(prev => 
                          isSelected ? prev.filter(c => c !== cat) : [...prev, cat]
                        )}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                          isSelected 
                            ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-500" 
                            : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50"
                        )}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4 block">Price Range</span>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground">$ {priceRange[0].toLocaleString()}</span>
                    <span className="text-muted-foreground">—</span>
                    <span className="text-foreground">$ {priceRange[1].toLocaleString()}</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="50000000"
                    step="500000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-cyan-500 h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground text-center italic">Up to Rp 50.000.000</p>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-3 block">Minimum Rating</span>
                <div className="flex flex-col gap-2">
                  {[4.5, 4, 3, 0].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl transition-all",
                        minRating === rating
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <div className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-full border",
                        minRating === rating ? "border-cyan-500 bg-cyan-500 text-white" : "border-border"
                      )}>
                        {minRating === rating && <Check className="h-2.5 w-2.5" />}
                      </div>
                      <span className="text-sm font-medium">{rating === 0 ? "All Ratings" : `${rating}+ Stars`}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button 
                onClick={() => setShowFilters(false)}
                className="mt-12 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-xs font-bold md:hidden"
            >
                View {filteredProducts.length} Results
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center">
        {filteredProducts.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/50">
                <PackageOpen className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">No gadgets found</h3>
            <p className="mt-1 text-xs text-muted-foreground">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="max-w-4xl grid grid-cols-2 gap-1 sm:gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Modal View */}
    {selectedProduct && (
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p) => {
          onAddToCart(p)
          setSelectedProduct(null)
        }}
      />
    )}
  </div>
)
}
