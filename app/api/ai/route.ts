import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { prompt, systemPrompt } = await req.json()

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system: systemPrompt || "You are an AI assistant helping with autonomous agent workflows.",
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error("AI generation error:", error)
    return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 })
  }
}
