// app/api/chat/route.ts
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query || query.trim() === "") {
      return NextResponse.json(
        { error: "Query cannot be empty" },
        { status: 400 }
      )
    }

    // FIXED: Correct endpoint path
    const response = await fetch("http://localhost:8000/api/v1/ask-whatsapp", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: query.trim() }),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      response: data.response || "No response from assistant",
    })
  } catch (error) {
    console.error("❌ Chat API Error:", error)
    return NextResponse.json(
      { 
        response: "Sorry, I'm having trouble connecting to the assistant. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}