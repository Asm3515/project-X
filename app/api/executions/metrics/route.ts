import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getExecutionMetrics } from "@/lib/services/execution-service"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const days = searchParams.get("days") ? Number.parseInt(searchParams.get("days")!) : 30

    const metrics = await getExecutionMetrics(session.user.id, days)

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Error fetching execution metrics:", error)
    return NextResponse.json({ error: "Failed to fetch execution metrics" }, { status: 500 })
  }
}
