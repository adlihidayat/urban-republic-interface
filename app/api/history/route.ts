import { NextResponse } from "next/server"

const HF_HISTORY_URL = "https://dhiyaadli123-urban-republic-ai.hf.space/api/v1/history"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")
  const userId = searchParams.get("user_id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(`${HF_HISTORY_URL}/${userId}`)
  if (sessionId) {
    // Actually user said session_id isn't related to history retrieval, 
    // but the backend supports filtering by it if needed.
    // For now we'll stick to user-wide history if the user wants all history.
    // url.searchParams.set("session_id", sessionId) 
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json([])
      }
      return NextResponse.json(
        { error: "Failed to fetch history" },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("History data from HF:", JSON.stringify(data, null, 2))
    
    // According to backend code, the response is HistoryResponse: { messages: [...] }
    const messages = data.messages || []
    return NextResponse.json(messages)
  } catch (error) {
    console.error("History proxy error:", error)
    return NextResponse.json([], { status: 200 })
  }
}
