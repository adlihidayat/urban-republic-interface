"use client"

import { ShoppingBag, BookOpen, Settings, ArrowRight } from "lucide-react"

const views: Record<
  string,
  { icon: React.ElementType; title: string; description: string; hint: string; gradient: string; iconColor: string }
> = {
  products: {
    icon: ShoppingBag,
    title: "Product Catalog",
    description: "Browse our complete electronics lineup with real-time pricing and availability.",
    hint: "Try asking about products in chat",
    gradient: "from-emerald-500/15 to-teal-500/10",
    iconColor: "text-emerald-400",
  },
  guide: {
    icon: BookOpen,
    title: "How It Works",
    description: "Learn how Urban AI helps you discover and compare the best electronics for your needs.",
    hint: "Ask anything -- we got you covered",
    gradient: "from-blue-500/15 to-cyan-500/10",
    iconColor: "text-blue-400",
  },
  settings: {
    icon: Settings,
    title: "Settings",
    description: "Manage your preferences, API key, and notification settings.",
    hint: "Your Groq key is stored locally",
    gradient: "from-zinc-500/15 to-zinc-400/10",
    iconColor: "text-zinc-400",
  },
}

interface PlaceholderViewProps {
  viewId: string
}

export function PlaceholderView({ viewId }: PlaceholderViewProps) {
  const view = views[viewId]
  if (!view) return null
  const Icon = view.icon

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
      <div className="relative animate-float">
        <div className={`flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br ${view.gradient} border border-border`}>
          <Icon className={`h-10 w-10 ${view.iconColor}`} />
        </div>
        <div className={`absolute inset-0 rounded-3xl bg-linear-to-br ${view.gradient} blur-2xl opacity-50 animate-glow-pulse`} />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground text-balance">{view.title}</h2>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
          {view.description}
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">{view.hint}</span>
        <ArrowRight className="h-3 w-3 text-muted-foreground" />
      </div>
    </div>
  )
}
