import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getExecutionById } from "@/lib/services/execution-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const execution = await getExecutionById(params.id, session.user.id)

    if (!execution) {
      return NextResponse.json({ error: "Execution not found" }, { status: 404 })
    }

    return NextResponse.json(execution)
  } catch (error) {
    console.error("Error fetching execution:", error)
    return NextResponse.json({ error: "Failed to fetch execution" }, { status: 500 })
  }
}
