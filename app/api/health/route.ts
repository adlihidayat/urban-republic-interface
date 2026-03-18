import { NextResponse } from "next/server"

// Using the main HF space URL to check health/wake it up
const HF_HEALTH_URL = "https://dhiyaadli123-urban-republic-ai.hf.space/health"

export async function GET() {
  try {
    const response = await fetch(HF_HEALTH_URL, {
      method: "GET",
      // Set a timeout to avoid waiting too long
      signal: AbortSignal.timeout(10000), 
    })

    if (!response.ok) {
        // If the endpoint doesn't exist but we get a response, it might still mean it's awake
        if (response.status === 404) {
            // Check if we can at least reach the space home
            const homeResponse = await fetch("https://dhiyaadli123-urban-republic-ai.hf.space/", { method: "HEAD" })
            if (homeResponse.ok) {
                return NextResponse.json({ status: "ready", source: "home_check" })
            }
        }
      return NextResponse.json({ status: "starting", code: response.status }, { status: 200 })
    }

    const data = await response.json().catch(() => ({ status: "ready" }))
    return NextResponse.json({ ...data, status: "ready" })
  } catch (error: any) {
    if (error.name === "TimeoutError") {
        return NextResponse.json({ status: "waking_up" }, { status: 200 })
    }
    console.error("Health check error:", error)
    return NextResponse.json({ status: "error", message: "Failed to connect to backend" }, { status: 200 })
  }
}
