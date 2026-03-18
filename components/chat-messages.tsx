"use client"

import { Sparkles, Camera, Watch, HelpCircle, ArrowRight, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  onSuggestionClick?: (text: string) => void
}

function formatContent(content: string) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []

  lines.forEach((line, i) => {
    let processed: React.ReactNode = line

    const boldParts = line.split(/\*\*(.*?)\*\*/g)
    if (boldParts.length > 1) {
      processed = boldParts.map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="font-semibold text-foreground">
            {part}
          </strong>
        ) : (
          part
        )
      )
    }

    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      elements.push(
        <li key={i} className="ml-4 list-disc text-muted-foreground">
          {typeof processed === "string" ? processed.replace(/^[\s]*[-*]\s/, "") : processed}
        </li>
      )
    } else if (/^\d+\.\s/.test(line.trim())) {
      elements.push(
        <li key={i} className="ml-4 list-decimal text-muted-foreground">
          {typeof processed === "string" ? processed.replace(/^[\s]*\d+\.\s/, "") : processed}
        </li>
      )
    } else if (line.trim() === "") {
      elements.push(<br key={i} />)
    } else {
      elements.push(
        <p key={i} className="leading-relaxed">
          {processed}
        </p>
      )
    }
  })

  return elements
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in-up">
      <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-secondary border border-border">
        <Sparkles className="h-3.5 w-3.5 text-foreground/60" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/40 animate-pulse-dot" />
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/40 animate-pulse-dot [animation-delay:0.2s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/40 animate-pulse-dot [animation-delay:0.4s]" />
      </div>
    </div>
  )
}

const suggestions = [
  { icon: Camera, text: "What are the best cameras for beginners?", iconColor: "text-violet-500" },
  { icon: Watch, text: "Help me find a smartwatch for my budget", iconColor: "text-emerald-500" },
  { icon: HelpCircle, text: "Tell me about Urban Republic's store policy", iconColor: "text-sky-500" },
]

export function ChatMessages({ messages, isLoading, onSuggestionClick }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center -mt-20 px-4">
        {/* Dia style Logo */}
        <div className="flex flex-col items-center gap-6 animate-fade-in-up">
          <div className="flex items-center gap-1.5 text-foreground">
            {/* The half-moon circle logo */}
            <Zap className="h-5 w-5 text-black" />
            <span className="text-xl font-medium tracking-tight font-serif drop-shadow-sm">Urban Republic</span>
          </div>

          <div className="text-center w-full max-w-3xl px-4">
            <h1 className="text-[3.5rem] sm:text-[2.5rem] font-medium tracking-[-0.03em] leading-[1.1] text-foreground text-balance">
              Shop smarter, ask anything
            </h1>
          </div>
          {/* short explanation of how to use */}
          <p className="text-[13px] text-muted-foreground font-medium max-w-lg text-center leading-relaxed">
            Welcome to Urban Republic AI. I can help you find the perfect gadgets, explain store policies, and manage your orders. How can I assist you today?
          </p>

          {/* Suggestion Bubbles */}
          <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-2xl">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => onSuggestionClick?.(suggestion.text)}
                className="flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-[12px] font-medium text-muted-foreground transition-all hover:bg-card hover:text-foreground hover:shadow-sm active:scale-95"
              >
                <suggestion.icon className={cn("h-3.5 w-3.5", suggestion.iconColor)} />
                {suggestion.text}
              </button>
            ))}
          </div>

          
        </div>
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        {messages.map((message, idx) => {
          const isUser = message.role === "user"
          return (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3 animate-fade-in-up",
                isUser ? "flex-row-reverse" : "flex-row"
              )}
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              {!isUser && (
                <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-foreground shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-background" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  isUser
                    ? "rounded-tr-sm bg-stone-200 text-foreground"
                    : "rounded-tl-sm  bg-card text-card-foreground"
                )}
              >
                {isUser ? (
                  <p className="leading-relaxed">{message.content}</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {formatContent(message.content)}
                  </div>
                )}
              </div>
            </div>
          )
        })}
        {isLoading && <TypingIndicator />}
      </div>
    </div>
  )
}
