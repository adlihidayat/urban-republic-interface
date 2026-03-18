"use client"

import { useState } from "react"
import { Eye, EyeOff, Zap, ArrowRight, ExternalLink, ShieldCheck, Cpu, Gauge } from "lucide-react"

interface WelcomeModalProps {
  onComplete: (apiKey?: string) => void
}

const features = [
  { icon: Cpu, label: "500+ Products", color: "text-cyan-400", bg: "from-cyan-500/15 to-sky-500/10" },
  { icon: ShieldCheck, label: "50+ Brands", color: "text-emerald-400", bg: "from-emerald-500/15 to-teal-500/10" },
  { icon: Gauge, label: "Instant AI", color: "text-blue-400", bg: "from-blue-500/15 to-cyan-500/10" },
]

export function WelcomeModal({ onComplete }: WelcomeModalProps) {
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)

  const handleGetStarted = async () => {
    if (apiKey.trim()) {
      try {
        await fetch("/api/groq/set-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey: apiKey.trim() }),
        })
      } catch (error) {
        console.error("Failed to set API key:", error)
      }
    }
    localStorage.setItem("hasSeenTutorial", "true")
    onComplete(apiKey.trim() || undefined)
  }

  const handleSkip = async () => {
    try {
      await fetch("/api/groq/clear-key", { method: "POST" })
    } catch (error) {
      console.error("Failed to clear API key:", error)
    }
    localStorage.setItem("hasSeenTutorial", "true")
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg">
      <div className="mx-4 w-full max-w-md animate-fade-in-up overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-cyan-500/5">
        {/* Top linear accent */}
        <div className="h-1 w-full bg-linear-to-r from-cyan-400 via-sky-500 to-cyan-400" />

        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            {/* Logo with glow */}
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400 to-sky-500 shadow-lg shadow-cyan-500/30">
                <Zap className="h-7 w-7 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-cyan-400 to-sky-500 blur-xl opacity-30 animate-glow-pulse" />
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-emerald-400 shadow-sm shadow-emerald-400/30">
                <span className="text-[9px] font-bold text-emerald-950">AI</span>
              </div>
            </div>

            <h2 className="mt-6 text-2xl font-bold text-card-foreground text-balance">
              Welcome to Urban AI
            </h2>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Your personal electronics assistant. Find gadgets, compare specs, and get instant recommendations.
            </p>
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-3 gap-2.5">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-3"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br ${f.bg}`}>
                    <Icon className={`h-4 w-4 ${f.color}`} />
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground">{f.label}</span>
                </div>
              )
            })}
          </div>

          {/* API Key input */}
          <div className="mt-6">
            <label htmlFor="api-key" className="block text-sm font-semibold text-card-foreground">
              Groq API Key
            </label>
            <div className="relative mt-2">
              <input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_xxxxxxxxxxxxxxxx"
                className="w-full rounded-xl border border-input bg-secondary/50 px-4 py-3 pr-10 text-sm text-foreground font-mono placeholder:text-muted-foreground/30 transition-all focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showKey ? "Hide API key" : "Show API key"}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              Get your free key at{" "}
              <a
                href="https://console.groq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-medium text-cyan-400 hover:underline underline-offset-2"
              >
                console.groq.com
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={handleGetStarted}
              className="group flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-400 to-sky-500 px-4 py-3 text-sm font-semibold text-primary-foreground transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={handleSkip}
              className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
