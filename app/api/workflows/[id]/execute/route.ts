import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getWorkflowById } from "@/lib/services/workflow-service"
import { getUserById } from "@/lib/services/user-service"
import { executeWorkflow } from "@/lib/ai/agent-executor"
import { isValidObjectId } from "@/lib/utils"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate the ID format
    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Invalid workflow ID format" }, { status: 400 })
    }

    const workflow = await getWorkflowById(params.id, session.user.id)

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    const { input } = await request.json()

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 })
    }

    // Get user's API keys
    const user = await getUserById(session.user.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const apiKeys = user.apiKeys || {}

    // Execute the workflow
    const execution = await executeWorkflow(workflow, input, session.user.id, apiKeys)

    return NextResponse.json(execution)
  } catch (error) {
    console.error("Error executing workflow:", error)
    return NextResponse.json(
      { error: "Failed to execute workflow", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
