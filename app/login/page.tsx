"use client"

import { Sparkles, Zap, Shield, ArrowRight, Key } from "lucide-react"
import { LoginButton, GuestLoginButton } from "@/components/login-button"
import { useState } from "react"
import { setGroqKeyAction } from "@/app/actions/auth-actions"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [groqKey, setGroqKey] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSetKey = async () => {
    if (groqKey.trim()) {
      await setGroqKeyAction(groqKey.trim())
    }
  }
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 bg-white">
      {/* Dia Precise Background Auroras */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#EAF0FF] blur-[100px] opacity-80" />
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#FFF0F5] blur-[100px] opacity-80" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#FFD1C6] blur-[120px] opacity-60" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#FFE4E8] blur-[120px] opacity-70" />
      </div>
      
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground shadow-xl shadow-foreground/10">
            <Zap className="h-7 w-7 text-background" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Urban AI</h1>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground mt-0.5">Electronics Assistant</p>
          </div>
        </div>


        {/* Card */}
        <div className="rounded-3xl border border-border/60 bg-card/80 p-6 backdrop-blur-2xl shadow-xl shadow-black/5">
          {/* Tagline */}
          <div className="mb-8 text-center flex flex-col items-center">
            <h2 className="text-xl font-semibold tracking-tight text-foreground leading-tight">
              Shop smarter, ask anything.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-72">
              Your personal AI expert for cameras, gadgets, and beyond.
            </p>
          </div>
          {/* Groq Key field */}
          <div className="mb-5 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-0.5">
              Enter your Groq API Key (Optional)
            </label>
            <div className="relative group">
              <input
                type="password"
                placeholder="gsk_..."
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/60 py-2.5 pl-4 pr-10 text-sm transition-all focus:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-foreground/10 placeholder:text-muted-foreground/40"
              />
              <Key className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 group-focus-within:text-foreground/40 transition-colors" />
            </div>
            <p className="text-[10px] text-muted-foreground/60 px-0.5 italic">
              Bypass rate limits with your own key. Stored securely.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <div onClick={handleSetKey}>
              <LoginButton />
            </div>
            
            <div className="relative flex items-center justify-center py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <span className="relative bg-card px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                or
              </span>
            </div>

            <div onClick={handleSetKey}>
              <GuestLoginButton />
            </div>
          </div>

          {/* Trust badge */}
          <div className=" w-full flex items-center justify-center">
            <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-secondary/60 px-2 w-fit py-1.5">
              <Shield className="h-3.5 w-3.5 text-muted-foreground/60" />
              <span className="text-[10px] font-medium text-muted-foreground/70">
                Secure auth powered by Supabase
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[11px] text-muted-foreground/40 font-medium tracking-wide">
          © 2026 URBAN REPUBLIC ELECTRONICS
        </p>
      </div>
    </div>
  )
}
