"use client"

import { useState, useEffect } from "react"
import { 
  Package, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  ExternalLink,
  ShoppingBag,
  CreditCard,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

interface OrderItem {
  name: string
  price: number
  quantity: number
  product_id: string
}

interface Order {
  id: string
  status: string
  total: number
  shipping_address: string
  estimated_delivery?: string
  created_at: string
  items: OrderItem[]
}

interface OrdersViewProps {
  userEmail: string | null
}

export function OrdersView({ userEmail }: OrdersViewProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userEmail) return

    const fetchOrders = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/orders?email=${userEmail}`)

        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }

        const data = await response.json()
        setOrders(data.orders || [])
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError("Could not load your orders. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [userEmail])

  const toggleOrder = (orderId: string) => {
    const next = new Set(expandedOrders)
    if (next.has(orderId)) {
      next.delete(orderId)
    } else {
      next.add(orderId)
    }
    setExpandedOrders(next)
  }

  if (!userEmail) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-transparent">
        <div className="relative mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-200/50">
            <Package className="h-10 w-10 text-amber-500" />
          </div>
          <div className="absolute inset-0 rounded-3xl bg-amber-500/5 blur-xl animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Login Required</h2>
        <p className="text-muted-foreground text-sm max-w-[280px] mb-6">
          Please sign in with your Google account to view and track your orders.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 space-y-4">
        <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center animate-pulse">
           <Package className="h-6 w-6 text-amber-500 animate-bounce" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading your orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center mt-20">
        <AlertCircle className="h-10 w-10 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">{error}</h3>
        <Button 
            variant="ghost" 
            className="mt-4 text-amber-500 hover:text-amber-600 hover:bg-amber-50"
            onClick={() => window.location.reload()}
        >
            Try Refreshing
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto px-6 py-8 z-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">My Orders</h1>
                <p className="text-sm text-muted-foreground">View and track your purchase history</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-secondary/80 px-4 py-1.5 border border-border">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-[11px] font-bold text-foreground">Updated live</span>
            </div>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed border-border bg-card/80">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-foreground">No orders yet</p>
            <p className="text-sm text-muted-foreground">When you make a purchase, it will appear here.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Order ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Total</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr 
                      className={cn(
                        "group transition-colors border-l-4",
                        order.status === 'shipped' ? "border-l-emerald-400" : 
                        order.status === 'pending' ? "border-l-amber-400" : "border-l-stone-300",
                        expandedOrders.has(order.id) ? "bg-secondary/20" : "hover:bg-secondary/10 cursor-pointer"
                      )}
                      onClick={() => toggleOrder(order.id)}
                    >
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-foreground">{order.id}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                          order.status === 'shipped' ? "bg-emerald-50 text-emerald-600" : 
                          order.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-muted text-muted-foreground"
                        )}>
                          {order.status === 'shipped' ? <Truck className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {order.status}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-foreground">
                          $ {order.total.toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="rounded-lg p-1.5 hover:bg-secondary transition-colors text-muted-foreground">
                          {expandedOrders.has(order.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Collapsible content */}
                    {expandedOrders.has(order.id) && (
                      <tr className="bg-secondary/5">
                        <td colSpan={5} className="px-8 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Items List */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <ShoppingBag className="h-3.5 w-3.5" />
                                Order Items
                              </h4>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between rounded-xl bg-card border border-border p-3">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-semibold text-foreground">{item.name}</span>
                                      <span className="text-[10px] text-muted-foreground">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="text-sm font-bold text-foreground">
                                      $ {item.price.toLocaleString("id-ID")}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping & Meta Data */}
                            <div className="space-y-6">
                              <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                  <Truck className="h-3.5 w-3.5" />
                                  Shipping Information
                                </h4>
                                <div className="rounded-xl bg-card border border-border p-4">
                                  <p className="text-sm text-foreground leading-relaxed">
                                    {order.shipping_address}
                                  </p>
                                  {order.estimated_delivery && (
                                    <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-emerald-600">
                                      <CheckCircle2 className="h-3.5 w-3.5" />
                                      Est. Delivery: {new Date(order.estimated_delivery).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-9 gap-2 rounded-xl text-xs font-bold border-border bg-card">
                                  <CreditCard className="h-3.5 w-3.5" />
                                  Invoice
                                </Button>
                                <Button variant="outline" size="sm" className="h-9 gap-2 rounded-xl text-xs font-bold border-border bg-card">
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  Track Request
                                </Button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// React for Fragment
import React from "react"
