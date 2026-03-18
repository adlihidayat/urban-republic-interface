import { 
  ShoppingBag,
  BookOpen,
  MessageSquare,
  Settings,
  Zap,
  Plus,
  ChevronRight,
  Sparkles,
  PanelLeftClose,
  ShieldCheck,
  Package,
  ShoppingCart,
  StickyNote
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LogoutButton } from "@/components/login-button"
import type { User } from "@supabase/supabase-js"
import { useState } from "react"
import { Button } from "./ui/button"
import { useIsMobile } from "./ui/use-mobile"

interface AppSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  user: User | null
  isCollapsed: boolean
  isOpen: boolean
  onToggle: () => void
  hasGroqKey?: boolean
  cartItemCount?: number
}

export function AppSidebar({ 
  activeTab, 
  onTabChange, 
  user,
  isCollapsed,
  isOpen,
  onToggle,
  hasGroqKey,
  cartItemCount = 0
}: AppSidebarProps) {
  const [imgError, setImgError] = useState(false)
  const isMobile = useIsMobile()

  const menuItems = [
    {
      id: "chat",
      label: "Chat",
      icon: MessageSquare,
      badge: null,
      iconColor: "text-violet-500",
      activeBg: "bg-violet-50",
    },
    {
      id: "products",
      label: "Products",
      icon: ShoppingBag,
      badge: null,
      iconColor: "text-emerald-500",
      activeBg: "bg-emerald-50",
    },
    {
      id: "cart",
      label: "Cart",
      icon: ShoppingCart,
      badge: cartItemCount > 0 ? cartItemCount.toString() : null,
      iconColor: "text-cyan-500",
      activeBg: "bg-cyan-50",
    },
    {
      id: "orders",
      label: "Orders",
      icon: Package,
      badge: null,
      iconColor: "text-amber-500",
      activeBg: "bg-amber-50",
    },
    {
      id: "notes",
      label: "Adli's Notes",
      icon: StickyNote,
      badge: null,
      iconColor: "text-sky-500",
      activeBg: "bg-sky-50",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      badge: null,
      iconColor: "text-stone-500",
      activeBg: "bg-stone-50",
    },
  ]

  return (
    <aside className={cn(
        "relative flex h-screen flex-col bg-sidebar-bg overflow-hidden transition-all duration-300 ease-in-out border-r border-sidebar-border",
        isMobile 
          ? (isOpen ? "fixed inset-y-0 left-0 z-50 w-70 translate-x-0 shadow-2xl shadow-black/10" : "fixed inset-y-0 left-0 z-50 w-70 -translate-x-full")
          : (isCollapsed ? "w-18" : "w-[256px]")
    )}>

      {/* Logo area */}
      <div className={cn(
        "relative flex items-center gap-3 px-5 transition-all duration-300",
        isCollapsed && !isMobile ? "justify-center px-0 pt-5 pb-4" : "pt-5 pb-4"
      )}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground shadow-sm">
          <Zap className="h-4.5 w-4.5 text-background" strokeWidth={2.5} />
        </div>
        {(!isCollapsed || isMobile) && (
          <div className="flex flex-1 flex-col overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-[14px] font-bold tracking-tight text-sidebar-foreground truncate">
              Urban AI
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted truncate">
              Electronics
            </span>
          </div>
        )}
        
        {/* Collapse Toggle for Desktop */}
        {!isMobile && !isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-7 w-7 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
        
        {/* Close button for Mobile */}
        {isMobile && isOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-7 w-7 text-sidebar-muted hover:bg-sidebar-accent"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
        )}
      </div>


      {/* Navigation */}
      <nav className={cn(
        "relative flex flex-col gap-0.5 px-3",
        isCollapsed && !isMobile && "items-center px-2"
      )}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={isCollapsed && !isMobile ? item.label : undefined}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-[13px] font-medium transition-all duration-200 w-full",
                isActive
                  ? "bg-sidebar-accent text-stone-700"
                  : "text-stone-500 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                isCollapsed && !isMobile && "justify-center px-0 h-11 w-11"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                  isActive ? "bg-background/15" : "bg-sidebar-accent group-hover:bg-sidebar-border"
                )}
              >
                <Icon
                  className={cn(
                    "h-3.75 w-3.75 transition-colors",
                    isActive ? "text-stone-700" : `${item.iconColor} group-hover:opacity-100 opacity-80`
                  )}
                />
              </div>
              {(!isCollapsed || isMobile) && (
                <>
                  <span className="flex-1 text-left truncate animate-in fade-in slide-in-from-left-2 duration-300">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={cn(
                        "flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-[10px] font-bold transition-colors animate-in zoom-in duration-300",
                        isActive
                          ? "bg-stone-400 text-background"
                          : "bg-sidebar-accent text-sidebar-muted"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          )
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom user section */}
      <div className={cn(
        "relative border-t border-sidebar-border px-3 py-3 transition-all duration-300 ",
        isCollapsed && !isMobile && "px-2"
      )}>
        <div className={cn(
            "flex items-center gap-2.5 rounded-xl p-2 transition-all duration-200 hover:bg-sidebar-accent",
            isCollapsed && !isMobile && "justify-center"
        )}>
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary border border-border overflow-hidden">
            {user?.user_metadata?.avatar_url && !imgError ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Avatar" 
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-xs font-bold text-foreground/60">
                {user?.email?.charAt(0).toUpperCase() || "G"}
              </span>
            )}
            <div className={cn(
                "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-sidebar-bg translate-x-0.5 translate-y-0.5",
                user ? "bg-emerald-400" : "bg-muted-foreground/30"
            )} />
          </div>
          {(!isCollapsed || isMobile) && (
            <>
              <div className="flex flex-1 flex-col overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="flex items-center gap-1.5">
                    <span className="truncate text-[12px] font-semibold text-sidebar-foreground">
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Guest User"}
                    </span>
                    {hasGroqKey && (
                        <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
                    )}
                </div>
                <span className="truncate text-[10px] text-sidebar-muted">
                    {user?.email || "Not signed in"}
                </span>
              </div>
              {(user || (typeof document !== 'undefined' && document.cookie.includes('is_guest=true'))) && (
                <div className="flex items-center gap-1 animate-in fade-in duration-300">
                    <LogoutButton />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
