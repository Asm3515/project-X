import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getExecutions } from "@/lib/services/execution-service"
import { getExecutionsByWorkflow } from "@/lib/services/execution-service"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get("workflowId")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 20

    let executions
    if (workflowId) {
      executions = await getExecutionsByWorkflow(workflowId, session.user.id, limit)
    } else {
      executions = await getExecutions(session.user.id, limit)
    }

    return NextResponse.json(executions)
  } catch (error) {
    console.error("Error fetching executions:", error)
    return NextResponse.json({ error: "Failed to fetch executions" }, { status: 500 })
  }
}
