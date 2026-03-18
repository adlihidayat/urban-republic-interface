"use server"

import { cookies } from "next/headers"

export async function setGroqKeyAction(apiKey: string) {
  const cookieStore = await cookies()
  
  cookieStore.set("groq_api_key", apiKey, {
    httpOnly: true,
    secure: process.env.NODE_NODE === "production",
    sameSite: "lax",
    path: "/",
    // Session cookie - expires when browser closes
  })
}

export async function removeGroqKeyAction() {
  const cookieStore = await cookies()
  cookieStore.delete("groq_api_key")
}

export async function getHasGroqKey() {
  const cookieStore = await cookies()
  return cookieStore.has("groq_api_key")
}
