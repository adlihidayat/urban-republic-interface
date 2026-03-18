import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const HF_CHAT_URL = "https://dhiyaadli123-urban-republic-ai.hf.space/api/v1/chat"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()
    const groqApiKey = cookieStore.get("groq_api_key")?.value

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (groqApiKey) {
      headers["X-Groq-API-Key"] = groqApiKey
    }

    const response = await fetch(HF_CHAT_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.detail || "Failed to communicate with the AI agent" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Chat proxy error:", error)
    return NextResponse.json(
      { error: "Internal server error while processing chat" },
      { status: 500 }
    )
  }
}
