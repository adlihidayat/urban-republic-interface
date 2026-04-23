import { NextResponse } from "next/server"
import fs from "fs"

const HF_PRODUCTS_URL = "https://dhiyaadli123-urban-republic-ai.hf.space/api/v1/products"

export const dynamic = 'force-dynamic'
const LOCAL_PRODUCTS_JSON = "c:/Users/adlih/Documents/learn-machine-learning/urban-republic-ai/data/products.json"

export async function GET() {
  try {
    const response = await fetch(HF_PRODUCTS_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: response.status }
      )
    }

    const data = await response.json()
    // The backend might return { products: [...] } or just [...]
    const products = data.products || data || []
    return NextResponse.json(products)

  } catch (error) {
    console.error("Products proxy error:", error)
    return NextResponse.json([], { status: 200 })
  }
}
