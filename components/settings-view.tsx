"use client"

import { useState } from "react"
import { Key, ShieldCheck, X, Trash2, Save, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { setGroqKeyAction, removeGroqKeyAction } from "@/app/actions/auth-actions"

interface SettingsViewProps {
  initialHasKey: boolean
}

export function SettingsView({ initialHasKey }: SettingsViewProps) {
  const [apiKey, setApiKey] = useState("")
  const [hasKey, setHasKey] = useState(initialHasKey)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSave = async () => {
    if (!apiKey.trim()) return
    setIsSaving(true)
    setMessage(null)
    try {
      await setGroqKeyAction(apiKey.trim())
      setHasKey(true)
      setApiKey("")
      setMessage({ type: 'success', text: 'API Key saved successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save API Key' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemove = async () => {
    setIsSaving(true)
    setMessage(null)
    try {
      await removeGroqKeyAction()
      setHasKey(false)
      setMessage({ type: 'success', text: 'API Key removed' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove API Key' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      <header className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white">
            <Key className="h-4 w-4" />
          </div>
          <h1 className="text-sm font-semibold text-foreground">Settings</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 z-20">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* API Key Section */}
          <section className="space-y-4 ">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-black tracking-tight">Groq API Configuration</h3>
              <p className="text-xs text-muted-black">
                Supply your own API key to bypass shared rate limits and use your own Groq usage tier.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-sm space-y-6">
              {hasKey ? (
                <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Custom API Key Active</p>
                      <p className="text-[11px] text-muted-foreground">Your key is stored securely in an httpOnly session cookie.</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleRemove}
                    disabled={isSaving}
                    className="text-red-400 hover:text-red-500 hover:bg-red-500/10 gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Paste your Groq API Key (gsk_...)"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full rounded-xl border border-input bg-secondary/50 py-3 pl-4 pr-12 text-sm transition-all focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Key className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <a 
                      href="https://console.groq.com/keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-500 hover:text-cyan-400 transition-colors"
                    >
                      Get Key at Groq Console
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <Button 
                      onClick={handleSave}
                      disabled={!apiKey.trim() || isSaving}
                      className="rounded-xl bg-linear-to-br from-cyan-500 to-cyan-800 shadow-lg shadow-cyan-500/20 px-6 h-10 gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Key
                    </Button>
                  </div>
                </div>
              )}

              {message && (
                <p className={cn(
                  "text-[11px] font-medium animate-in fade-in slide-in-from-top-1",
                  message.type === 'success' ? "text-emerald-400" : "text-red-400"
                )}>
                  {message.text}
                </p>
              )}
            </div>
          </section>

          {/* Info Section */}
          <section className="rounded-2xl border border-border bg-card/80 p-6 space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <h4 className="text-xs font-bold uppercase tracking-widest">Privacy & Security</h4>
            </div>
            <ul className="space-y-3">
              {[
                "Your API key is never stored in our database.",
                "It is stored in a secure 'httpOnly' cookie that JavaScript cannot access.",
                "The key is forwarded only to the HuggingFace agent via our secure proxy.",
                "Session keys are automatically cleared when you sign out."
              ].map((text, i) => (
                <li key={i} className="flex gap-3 text-xs text-muted-foreground leading-relaxed">
                  <span className="flex h-1.5 w-1.5 shrink-0 translate-y-2 rounded-full bg-cyan-500/40" />
                  {text}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
