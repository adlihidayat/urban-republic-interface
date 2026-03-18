"use client"

import { useState, useEffect, useCallback } from "react"
import { Sparkles, Wifi, Zap } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChatMessages, type Message } from "@/components/chat-messages"
import { ChatInput } from "@/components/chat-input"
import { WelcomeModal } from "@/components/welcome-modal"
import { PlaceholderView } from "@/components/placeholder-view"
import { ProductList } from "@/components/product-list"
import { createClient } from "@/lib/supabase/client"
import { LoginButton, LogoutButton } from "@/components/login-button"
import type { User } from "@supabase/supabase-js"
import { useIsMobile } from "@/components/ui/use-mobile"
import { Button } from "@/components/ui/button"
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { SettingsView } from "@/components/settings-view"
import { OrdersView } from "@/components/orders-view"
import { CartView } from "@/components/cart-view"
import { NotesView } from "@/components/notes-view"
import { getHasGroqKey } from "@/app/actions/auth-actions"

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

interface ChatHeaderProps {
  healthStatus: "ready" | "waking_up" | "starting" | "error" | "offline"
  showToggle?: boolean
}

function ChatHeader({ healthStatus, showToggle }: ChatHeaderProps) {
  return (
    <header className={cn(
        "flex items-center justify-between border-b border-border/60 bg-card/80 px-6 py-3 backdrop-blur-xl transition-all duration-300",
        showToggle && "pl-14 lg:pl-16"
    )}>
      <div className="flex items-center gap-3">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-foreground shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-background" />
          <div className={cn(
            "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card transition-colors duration-500",
            healthStatus === "ready" ? "bg-emerald-400" : 
            healthStatus === "error" || healthStatus === "offline" ? "bg-red-400" : "bg-amber-400"
          )} />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground">Urban AI Assistant</h1>
          <div className="flex items-center gap-1.5">
            <div className={cn(
                "h-1.5 w-1.5 rounded-full",
                healthStatus === "ready" ? "bg-emerald-400" : 
                healthStatus === "error" || healthStatus === "offline" ? "bg-red-400" : "bg-amber-400 animate-pulse"
            )} />
            <span className={cn(
                "text-[11px] font-medium",
                healthStatus === "ready" ? "text-emerald-500" : 
                healthStatus === "error" || healthStatus === "offline" ? "text-red-400" : "text-amber-500"
            )}>
                {healthStatus === "ready" ? "Online" : healthStatus === "waking_up" ? "Waking up..." : healthStatus === "starting" ? "Starting..." : "Offline"}
            </span>
            <span className="text-[11px] text-muted-foreground/40">{"•"}</span>
            <span className="text-[11px] text-muted-foreground/60">Groq Llama 3.3</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-3 py-1.5">
        <div className={cn(
            "h-1.5 w-1.5 rounded-full",
            healthStatus === "ready" ? "bg-emerald-400" : "bg-muted-foreground/30"
        )} />
        <span className="text-[11px] font-medium text-muted-foreground">
            {healthStatus === "ready" ? "Ready" : "Waiting"}
        </span>
      </div>
    </header>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export interface CartItem {
  product_id: string
  name: string
  price: number
  quantity: number
  image_url?: string
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("chat")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const [mounted, setMounted] = useState(false)
  const [healthStatus, setHealthStatus] = useState<"ready" | "waking_up" | "starting" | "error" | "offline">("offline")
  const [user, setUser] = useState<User | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [hasGroqKey, setHasGroqKey] = useState(false)
  const isMobile = useIsMobile()
  const supabase = createClient()

  // Product List Shared States (Lifted for persistence)
  const [products, setProducts] = useState<any[]>([])
  const [isProductsLoading, setIsProductsLoading] = useState(false)
  const [productSearchQuery, setProductSearchQuery] = useState("")
  const [productSelectedCategories, setProductSelectedCategories] = useState<string[]>([])
  const [productPriceRange, setProductPriceRange] = useState<[number, number]>([0, 50000000])
  const [productMinRating, setProductMinRating] = useState<number>(0)
  const [productShowFilters, setProductShowFilters] = useState(false)

  // Cart State Management
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab)
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [isMobile])

  // Cart persistence effect
  useEffect(() => {
    if (!mounted) return
    const savedCart = localStorage.getItem("urban_cart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart from localStorage")
      }
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("urban_cart", JSON.stringify(cartItems))
  }, [cartItems, mounted])

  const addToCart = useCallback((product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product_id === product.id)
      if (existing) {
        return prev.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      }
      return [...prev, {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url: product.image_url
      }]
    })
  }, [])

  const updateCartQuantity = useCallback((productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product_id === productId) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(item => item.product_id !== productId))
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  // Product fetching logic
  const fetchProducts = useCallback(async () => {
    if (products.length > 0 || isProductsLoading) return
    
    setIsProductsLoading(true)
    try {
      const res = await fetch("/api/products")
      if (res.ok) {
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setIsProductsLoading(false)
    }
  }, [products.length, isProductsLoading])

  // Fetch products when moving to products tab
  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts()
    }
  }, [activeTab, fetchProducts])

  // Chat history hydration
  useEffect(() => {
    if (!mounted) return

    const storedSessionId = localStorage.getItem("chat_session_id") || sessionId
    
    const fetchHistory = async () => {
      // Only load history for logged-in users. 
      // Guests start with a fresh blank array as per request.
      if (!user) {
        setIsHistoryLoading(false)
        setMessages([])
        return
      }
      
      const email = user.email
      setIsHistoryLoading(true)
      try {
        const res = await fetch(`/api/history?session_id=${storedSessionId}&user_id=${email}`)
        if (res.ok) {
          const history = await res.json()
          if (Array.isArray(history) && history.length > 0) {
            setMessages(history.map(m => ({
              id: m.id?.toString() || generateId(),
              role: m.role as "user" | "assistant",
              content: m.content || "",
              timestamp: m.created_at || new Date().toISOString()
            })))
          } else {
            setMessages([])
          }
        } else {
          setMessages([])
        }
      } catch (error) {
        console.error("Failed to fetch history:", error)
        setMessages([])
      } finally {
        setIsHistoryLoading(false)
      }
    }

    fetchHistory()
  }, [user, mounted, sessionId])

  // Health check polling
  useEffect(() => {
    if (!mounted) return

    let pollInterval: NodeJS.Timeout
    const checkHealth = async () => {
      try {
        const res = await fetch("/api/health")
        const data = await res.json()
        setHealthStatus(data.status)
        if (data.status === "ready") {
          clearInterval(pollInterval)
        }
      } catch (error) {
        console.error("Health check failed:", error)
        setHealthStatus(prev => (prev === "ready" ? "ready" : "error"))
      }
    }

    checkHealth()
    pollInterval = setInterval(checkHealth, 5000)

    return () => clearInterval(pollInterval)
  }, [mounted])

  // Auth session management
  useEffect(() => {
    if (!mounted) return

    const getUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [mounted, supabase.auth])

  // Initial setup
  useEffect(() => {
    setMounted(true)
    
    let storedSessionId = localStorage.getItem("chat_session_id")
    if (!storedSessionId) {
      storedSessionId = generateId()
      localStorage.setItem("chat_session_id", storedSessionId)
    }
    setSessionId(storedSessionId)

    const hasSeen = localStorage.getItem("hasSeenTutorial")
    if (!hasSeen) {
      setShowWelcome(true)
    }

    const checkKey = async () => {
      const hasKey = await getHasGroqKey()
      setHasGroqKey(hasKey)
    }
    checkKey()
  }, [])

  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false)
  }, [])

  const handleSendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content,
      }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content,
            session_id: sessionId,
            user_id: user?.email || (document.cookie.includes('is_guest=true') ? 'guest' : null) || 'anonymous'
          }),
        })

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()

        const assistantMessage: Message = {
          id: generateId(),
          role: "assistant",
          content:
            data.response ||
            data.message ||
            data.reply ||
            "Sorry, I could not process your request.",
        }
        setMessages((prev) => [...prev, assistantMessage])
      } catch {
        const errorMessage: Message = {
          id: generateId(),
          role: "assistant",
          content:
            "I'm having trouble connecting to the server. Please make sure the API is running at localhost:8000 and your Groq API key is configured correctly.",
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [sessionId, user]
  )

  if (!mounted) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        user={user} 
        isCollapsed={isSidebarCollapsed}
        isOpen={isSidebarOpen}
        onToggle={() => isMobile ? setIsSidebarOpen(!isSidebarOpen) : setIsSidebarCollapsed(!isSidebarCollapsed)}
        hasGroqKey={hasGroqKey}
        cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
      />

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="relative flex flex-1 flex-col overflow-hidden bg-white">
        {/* Dia Precise Background Auroras */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#EAF0FF] blur-[100px] opacity-80" />
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#FFF0F5] blur-[100px] opacity-80" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#FFD1C6] blur-[120px] opacity-60" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#FFE4E8] blur-[120px] opacity-70" />
        </div>

        {/* Responsive Toggle Button (Fixed/Floating) */}
        <div className="absolute top-3 left-3.5 z-40">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => isMobile ? setIsSidebarOpen(true) : setIsSidebarCollapsed(false)}
            className={cn(
              "h-8 w-8 bg-card/90 backdrop-blur-md border border-border shadow-sm transition-all duration-500",
              !isMobile && !isSidebarCollapsed && "opacity-0 pointer-events-none -translate-x-4 scale-75",
              isMobile && isSidebarOpen && "opacity-0 pointer-events-none -translate-x-4 scale-75",
              !isMobile && isSidebarCollapsed && "opacity-100 translate-x-0 scale-100"
            )}
          >
            {isMobile ? <Menu className="h-4 w-4 text-foreground" /> : <PanelLeftOpen className="h-4 w-4 text-foreground" />}
          </Button>
        </div>

        {activeTab === "chat" ? (
          isHistoryLoading ? (
            <HistoryLoadingView />
          ) : (
            <>
              <ChatHeader 
                healthStatus={healthStatus} 
                showToggle={(isMobile && !isSidebarOpen) || (!isMobile && isSidebarCollapsed)} 
              />
              <ChatMessages
                messages={messages}
                isLoading={isLoading}
                onSuggestionClick={handleSendMessage}
              />
              <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            </>
          )
        ) : activeTab === "products" ? (
          <ProductList 
            products={products}
            isLoading={isProductsLoading}
            searchQuery={productSearchQuery}
            setSearchQuery={setProductSearchQuery}
            selectedCategories={productSelectedCategories}
            setSelectedCategories={setProductSelectedCategories}
            priceRange={productPriceRange}
            setPriceRange={setProductPriceRange}
            minRating={productMinRating}
            setMinRating={setProductMinRating}
            showFilters={productShowFilters}
            setShowFilters={setProductShowFilters}
            onAddToCart={addToCart}
          />
        ) : activeTab === "cart" ? (
          <CartView 
            items={cartItems}
            onUpdateQuantity={updateCartQuantity}
            onRemove={removeFromCart}
            onClear={clearCart}
            userEmail={user?.email || null}
            onCheckoutSuccess={() => setActiveTab("orders")}
          />
        ) : activeTab === "orders" ? (
          <OrdersView userEmail={user?.email || null} />
        ) : activeTab === "notes" ? (
          <NotesView />
        ) : activeTab === "settings" ? (
          <SettingsView initialHasKey={hasGroqKey} />
        ) : (
          <PlaceholderView viewId={activeTab} />
        )}
      </main>

      {showWelcome && <WelcomeModal onComplete={handleWelcomeComplete} />}
    </div>
  )
}

function HistoryLoadingView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground shadow-lg shadow-foreground/10">
          <Zap className="h-7 w-7 text-background animate-pulse" />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-foreground/10 blur-xl opacity-60 animate-glow-pulse" />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <h3 className="text-sm font-semibold text-foreground tracking-tight">Syncing History</h3>
        <p className="text-xs text-muted-foreground animate-pulse">Checking previous conversations...</p>
      </div>
    </div>
  )
}
