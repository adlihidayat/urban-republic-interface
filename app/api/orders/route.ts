import { NextResponse } from "next/server"

const HF_ORDERS_BASE_URL = "https://dhiyaadli123-urban-republic-ai.hf.space/api/v1/orders"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const response = await fetch(`${HF_ORDERS_BASE_URL}/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch orders from backend" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Orders proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, shipping_address, items } = body

    if (!email || !shipping_address || !items) {
      return NextResponse.json({ error: "Missing required fields (email, address, items)" }, { status: 400 })
    }

    const response = await fetch(HF_ORDERS_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, shipping_address, items }),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return NextResponse.json(
          { error: errorData.detail || "Failed to create order on backend" },
          { status: response.status }
        )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Order creation proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
