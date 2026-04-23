"use client"

import { useState } from "react"
import { ShoppingCart, Trash2, Plus, Minus, MapPin, CreditCard, ChevronRight, CheckCircle2, ArrowRight } from "lucide-react"
import { CartItem } from "@/app/page"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

interface CartViewProps {
  items: CartItem[]
  onUpdateQuantity: (productId: string, delta: number) => void
  onRemove: (productId: string) => void
  onClear: () => void
  userEmail: string | null
  onCheckoutSuccess: () => void
}

export function CartView({ 
  items, 
  onUpdateQuantity, 
  onRemove, 
  onClear,
  userEmail,
  onCheckoutSuccess
}: CartViewProps) {
  const [address, setAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = 15 // Fixed $15 shipping
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax + shipping

  const handleCheckout = async () => {
    if (!userEmail) {
      setError("Please sign in to place an order.")
      return
    }
    if (!address.trim()) {
      setError("Please enter a shipping address.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          shipping_address: address,
          items: items.map(item => ({
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to place order")
      }

      setSuccess(true)
      onClear()
      setTimeout(() => {
        onCheckoutSuccess()
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Order Placed Successfully!</h2>
        <p className="mt-2 text-muted-foreground">Redirecting you to your order history...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary/50 text-muted-foreground/30">
          <ShoppingCart className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Add some premium gadgets to get started.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card/50 px-8 py-6 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-xs text-muted-foreground mt-1">{items.length} items in your bag</p>
        </div>
        {!userEmail && (
          <div className="rounded-xl bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-500 border border-amber-500/20">
            Login Required for Checkout
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden lg:flex-row flex-col z-10">
        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-6">
            {items.map((item) => (
              <div 
                key={item.product_id}
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-2xl border border-border bg-card/40 p-4 transition-all hover:bg-card hover:shadow-lg hover:shadow-cyan-500/5"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary/50 border border-border">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingCart className="h-8 w-8 text-muted-foreground/20" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">ID: {item.product_id}</p>
                    <p className="mt-2 text-base font-bold text-cyan-500">
                      $ {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                    <div className="flex items-center rounded-xl bg-secondary/50 p-1 border border-border">
                      <button 
                        onClick={() => onUpdateQuantity(item.product_id, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.product_id, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button 
                      onClick={() => onRemove(item.product_id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground/40 hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Sidebar */}
        <div className="w-full lg:w-[400px] border-l border-border bg-card/30 p-8 backdrop-blur-md">
          <div className="sticky top-0">
            <h2 className="text-lg font-bold text-foreground">Order Summary</h2>
            
            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">$ {subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span className="font-bold">$ {tax.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-bold text-foreground">$ {shipping.toLocaleString("id-ID")}.00</span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between">
                <span className="text-base font-bold">Total</span>
                <span className="text-xl font-extrabold text-foreground">$ {total.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="mt-10 space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <MapPin className="h-3 w-3 text-cyan-500" />
                  Shipping Address
                </label>
                <textarea 
                  placeholder="Enter your full delivery address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-24 rounded-2xl border border-border bg-card/50 p-4 text-sm focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 transition-all placeholder:text-muted-foreground/30 resize-none"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-500/10 p-3 text-xs font-medium text-red-500 border border-red-500/20 animate-shake">
                  {error}
                </div>
              )}

              <Button 
                onClick={handleCheckout}
                disabled={isSubmitting || !userEmail}
                className="w-full bg-linear-to-r from-cyan-400 to-sky-500 py-7 text-base font-bold text-primary-foreground shadow-xl shadow-cyan-500/20 transition-all hover:shadow-cyan-500/30 hover:scale-[1.01] active:scale-[0.99] group overflow-hidden"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <>
                    Checkout Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              {!userEmail && (
                <p className="text-[10px] text-center text-muted-foreground mt-4">
                  * Please log in to complete your transaction securely.
                </p>
              )}
            </div>

            <div className="mt-8 flex items-center justify-center gap-3 grayscale opacity-30">
               <span className="text-[10px] font-bold uppercase tracking-widest">Secure Payment:</span>
               <CreditCard className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
