"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { ArrowUp, Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInput = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      const maxHeight = 24 * 5
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
    }
  }, [])

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }, [value, disabled, onSend])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const hasValue = value.trim().length > 0

  return (
    <div className="bg-transparent px-4 pb-6  z-10 relative">
      <div className="mx-auto max-w-180 relative">
        <div
          className={cn(
            "flex flex-row items-center justify-center rounded-xl bg-white/90 backdrop-blur-xl p-2 pl-4 pr-3 shadow-xs border border-black/20 transition-all duration-300 focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.12)] focus-within:bg-white",
          )}
        >
          <div className="flex flex-1 flex-col justify-center gap-2.5 py-1.5 pl-1 pr-4">
            <div className="flex items-center gap-3">
              <Search className="h-4.5 w-4.5 text-black/40" strokeWidth={2.5} />
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  handleInput()
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything to urban assitance..."
                rows={1}
                disabled={disabled}
                className="max-h-30 flex-1 resize-none bg-transparent py-0 text-sm font-normal text-black placeholder:text-black/40 focus:outline-none disabled:opacity-50 leading-relaxed"
              />
            </div>
            

          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!hasValue || disabled}
            className={cn(
              "flex items-center justify-center h-8 w-8 shrink-0 self-end rounded-full transition-all duration-200",
              hasValue && !disabled
                ? "bg-black text-white shadow-md active:scale-95"
                : "bg-black text-white shadow-md cursor-pointer active:scale-95" // In dia screenshot it's black even if empty, representing a mic/up state usually, we'll keep it active looking
            )}
            aria-label="Send message"
          >
            <ArrowUp className="h-4.5 w-4.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
      
    </div>
  )
}
