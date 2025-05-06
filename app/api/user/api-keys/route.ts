import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { updateApiKeys } from "@/lib/services/user-service"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate API keys
    const apiKeys: Record<string, string> = {}

    if (data.openai) {
      apiKeys.openai = data.openai
    }

    if (data.anthropic) {
      apiKeys.anthropic = data.anthropic
    }

    if (data.pinecone) {
      apiKeys.pinecone = data.pinecone
    }

    const user = await updateApiKeys(session.user.id, apiKeys)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "API keys updated successfully",
    })
  } catch (error) {
    console.error("Error updating API keys:", error)
    return NextResponse.json({ error: "Failed to update API keys" }, { status: 500 })
  }
}
