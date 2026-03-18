"use client"

import { StickyNote, Info, Lightbulb, ShieldAlert, Zap, Cpu, MousePointer2, Map, MessageCircle, ExternalLink } from "lucide-react"

export function NotesView() {
  const sections = [
    {
      title: "Project Explanation",
      icon: Info,
      content: "Urban Republic AI is a futuristic e-commerce concept designed to demonstrate the synergy between modern web design and artificial intelligence. The goal is to create a 'living' shopping experience where an AI assistant understands context, provides real-time recommendations, and helps users navigate a premium catalog of electronics.",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "How to Use the App",
      icon: MousePointer2,
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Chat:</strong> Use the AI Assistant to ask about products, order, store policy, or just say hello.</li>
          <li><strong>Products:</strong> Browse, filter, and search through a curated list of high-end gadgets.</li>
          <li><strong>Cart:</strong> Add your favorite items to the cart and see your real-time total.</li>
          <li><strong>Orders:</strong> Track your simulated transactions and view detailed receipts.</li>
        </ul>
      ),
      color: "bg-emerald-500/10 text-emerald-500"
    },
    {
        title: "Simulation Disclaimer",
        icon: ShieldAlert,
        content: "Please note that this application is a prototype. All orders, costs, and products are mocks. No real credit card information is required, no actual payments are processed, and no physical items will be delivered.",
        color: "bg-amber-500/10 text-amber-500"
    },
    {
        title: "Privacy & Data",
        icon: Zap,
        content: "We value your privacy. Your Groq API key is stored in a secure, server-side cookie (httpOnly). Order data and chat history are processed for demonstration purposes and are not stored permanently in a production-scale database.",
        color: "bg-purple-500/10 text-purple-500"
    },
    {
        title: "Technology Stack",
        icon: Cpu,
        content: "Built using the latest web technologies: Next.js 16 (App Router), Tailwind CSS for premium styling, Supabase for authentication, and Lucide-react for iconography. The AI logic is powered by Groq's LPU™ technology.",
        color: "bg-cyan-500/10 text-cyan-500"
    },
    {
        title: "Contact & Feedback",
        icon: MessageCircle,
        content: (
          <div className="flex flex-col gap-4">
            <p>Have suggestions or want to collaborate? I'd love to hear from you! Reach out via the feedback form or connect with me directly through my portfolio links.</p>
            <a 
              href="https://dhiya-adli.tech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group/btn flex items-center gap-2 w-fit rounded-xl bg-pink-500/10 px-4 py-2.5 text-xs font-bold text-pink-500 transition-all hover:bg-pink-500 hover:text-white"
            >
              Visit My Portfolio
              <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          </div>
        ),
        color: "bg-pink-500/10 text-pink-500"
    }
  ]

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-background">
      <div className="mx-auto w-full max-w-4xl px-8 py-12 z-10">
        <header className="mb-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500">
               <StickyNote className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Adli's Notes</h1>
              <p className="text-sm text-muted-foreground mt-1">Everything you need to know about the Urban Republic AI project.</p>
            </div>
          </div>
        </header>

        <div className="grid gap-2">
          {sections.map((section, i) => (
            <div 
              key={i} 
              className="group relative overflow-hidden rounded-3xl border border-border bg-card/80 p-8 transition-all hover:bg-card hover:shadow-xl hover:shadow-cyan-500/5"
            >
              <div className="flex items-start gap-6">
                <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${section.color}`}>
                  <section.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-foreground mb-3">{section.title}</h2>
                  <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {section.content}
                  </div>
                </div>
              </div>
              
              {/* Subtle hover accent */}
              <div className="absolute left-0 top-0 h-full w-1 bg-linear-to-b from-transparent via-cyan-500/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
