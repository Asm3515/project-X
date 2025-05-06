import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import type { WorkflowWithId } from "../models/workflow"
import type { ExecutionWithId } from "../models/execution"
import { createExecution, updateExecution, addExecutionLog } from "../services/execution-service"
import { ObjectId } from "mongodb"
import { getToolExecutor } from "./tool-executor"

export async function executeWorkflow(
  workflow: WorkflowWithId,
  input: string,
  userId: string,
  apiKeys: Record<string, string>,
): Promise<ExecutionWithId> {
  // Create a new execution record
  const execution = await createExecution({
    workflowId: workflow._id,
    userId: new ObjectId(userId),
    status: "Running",
    input,
    logs: [],
    metrics: {
      startTime: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  try {
    // Log the start of execution
    await addExecutionLog(execution._id.toString(), {
      timestamp: new Date(),
      level: "info",
      message: `Starting workflow execution: ${workflow.name}`,
    })

    // Find the input node
    const inputNode = workflow.nodes.find((node) => node.type === "input")
    if (!inputNode) {
      throw new Error("No input node found in workflow")
    }

    // Execute the workflow by traversing the graph
    const result = await traverseWorkflow(workflow, inputNode.id, { input }, execution._id.toString(), apiKeys)

    // Calculate execution duration
    const endTime = new Date()
    const duration = endTime.getTime() - execution.metrics.startTime.getTime()

    // Update execution with results
    const updatedExecution = await updateExecution(execution._id.toString(), {
      status: "Completed",
      output: result.output,
      metrics: {
        ...execution.metrics,
        endTime,
        duration,
        tokenUsage: result.tokenUsage,
        cost: calculateCost(result.tokenUsage),
      },
    })

    return updatedExecution!
  } catch (error) {
    console.error("Workflow execution error:", error)

    // Log the error
    await addExecutionLog(execution._id.toString(), {
      timestamp: new Date(),
      level: "error",
      message: `Execution error: ${error instanceof Error ? error.message : String(error)}`,
    })

    // Update execution with error status
    const endTime = new Date()
    const duration = endTime.getTime() - execution.metrics.startTime.getTime()

    const updatedExecution = await updateExecution(execution._id.toString(), {
      status: "Failed",
      metrics: {
        ...execution.metrics,
        endTime,
        duration,
      },
    })

    return updatedExecution!
  }
}

async function traverseWorkflow(
  workflow: WorkflowWithId,
  currentNodeId: string,
  context: Record<string, any>,
  executionId: string,
  apiKeys: Record<string, string>,
): Promise<{ output: string; tokenUsage: { prompt: number; completion: number; total: number } }> {
  // Find the current node
  const currentNode = workflow.nodes.find((node) => node.id === currentNodeId)
  if (!currentNode) {
    throw new Error(`Node not found: ${currentNodeId}`)
  }

  // Log node execution
  await addExecutionLog(executionId, {
    timestamp: new Date(),
    level: "info",
    message: `Executing node: ${currentNode.data.label || currentNode.type}`,
    nodeId: currentNodeId,
  })

  let nodeResult: any
  let tokenUsage = { prompt: 0, completion: 0, total: 0 }

  // Process the node based on its type
  switch (currentNode.type) {
    case "input":
      nodeResult = context.input
      break

    case "agent":
      const agentResult = await executeAgent(currentNode.data, context, executionId, apiKeys)
      nodeResult = agentResult.output
      tokenUsage = agentResult.tokenUsage
      break

    case "tool":
      const toolExecutor = getToolExecutor(currentNode.data.toolType)
      nodeResult = await toolExecutor(currentNode.data, context, apiKeys)
      break

    case "condition":
      // Evaluate the condition
      const conditionResult = evaluateCondition(currentNode.data.condition, context)

      // Find the next node based on condition result
      const outgoingEdges = workflow.edges.filter((edge) => edge.source === currentNodeId)
      const nextEdge = outgoingEdges.find(
        (edge) =>
          (conditionResult && edge.sourceHandle === "true") || (!conditionResult && edge.sourceHandle === "false"),
      )

      if (!nextEdge) {
        throw new Error(`No matching edge found for condition result: ${conditionResult}`)
      }

      // Continue traversal with the next node
      return traverseWorkflow(workflow, nextEdge.target, context, executionId, apiKeys)

    case "output":
      return {
        output: typeof context.result === "string" ? context.result : JSON.stringify(context.result),
        tokenUsage,
      }

    default:
      throw new Error(`Unsupported node type: ${currentNode.type}`)
  }

  // Update the context with the result of this node
  const updatedContext = {
    ...context,
    result: nodeResult,
  }

  // Find outgoing edges from this node
  const outgoingEdges = workflow.edges.filter((edge) => edge.source === currentNodeId)

  if (outgoingEdges.length === 0) {
    // If there are no outgoing edges, return the result
    return {
      output: typeof nodeResult === "string" ? nodeResult : JSON.stringify(nodeResult),
      tokenUsage,
    }
  }

  // Continue traversal with the first outgoing edge
  // (for non-condition nodes, we just follow the first edge)
  return traverseWorkflow(workflow, outgoingEdges[0].target, updatedContext, executionId, apiKeys)
}

async function executeAgent(
  agentData: any,
  context: Record<string, any>,
  executionId: string,
  apiKeys: Record<string, string>,
): Promise<{ output: string; tokenUsage: { prompt: number; completion: number; total: number } }> {
  // Log agent execution
  await addExecutionLog(executionId, {
    timestamp: new Date(),
    level: "info",
    message: `Executing agent: ${agentData.label}`,
    data: { model: agentData.model },
  })

  // Prepare the prompt
  const systemPrompt =
    agentData.systemPrompt ||
    `You are ${agentData.label}, an AI assistant that ${agentData.description || "helps users with their tasks"}.`

  const userPrompt = typeof context.input === "string" ? context.input : JSON.stringify(context.input)

  try {
    // Select the model provider based on the model name
    let model
    if (agentData.model.startsWith("gpt-")) {
      if (!apiKeys.openai) {
        throw new Error("OpenAI API key is required but not provided")
      }
      model = openai(agentData.model, { apiKey: apiKeys.openai })
    } else if (agentData.model.startsWith("claude-")) {
      if (!apiKeys.anthropic) {
        throw new Error("Anthropic API key is required but not provided")
      }
      model = anthropic(agentData.model, { apiKey: apiKeys.anthropic })
    } else {
      throw new Error(`Unsupported model: ${agentData.model}`)
    }

    // Generate text with the AI model
    const { text, usage } = await generateText({
      model,
      system: systemPrompt,
      prompt: userPrompt,
    })

    // Log completion
    await addExecutionLog(executionId, {
      timestamp: new Date(),
      level: "info",
      message: `Agent completed: ${agentData.label}`,
      data: {
        tokenUsage: usage,
      },
    })

    return {
      output: text,
      tokenUsage: {
        prompt: usage?.promptTokens || 0,
        completion: usage?.completionTokens || 0,
        total: usage?.totalTokens || 0,
      },
    }
  } catch (error) {
    // Log error
    await addExecutionLog(executionId, {
      timestamp: new Date(),
      level: "error",
      message: `Agent error: ${error instanceof Error ? error.message : String(error)}`,
    })
    throw error
  }
}

function evaluateCondition(conditionExpression: string, context: Record<string, any>): boolean {
  try {
    // Create a safe evaluation context with only the necessary variables
    const evalContext = { ...context }

    // Create a function that evaluates the condition in the context
    const conditionFn = new Function(...Object.keys(evalContext), `return ${conditionExpression};`)

    // Execute the function with the context values
    return conditionFn(...Object.values(evalContext))
  } catch (error) {
    console.error("Error evaluating condition:", error)
    return false
  }
}

function calculateCost(tokenUsage: { prompt: number; completion: number; total: number }): number {
  // Simple cost calculation based on token usage
  // These rates are approximate and should be adjusted based on actual pricing
  const promptRate = 0.00001 // $0.01 per 1000 tokens
  const completionRate = 0.00003 // $0.03 per 1000 tokens

  return tokenUsage.prompt * promptRate + tokenUsage.completion * completionRate
}
