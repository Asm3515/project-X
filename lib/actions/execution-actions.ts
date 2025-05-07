"use server"

import {
  getExecutions,
  getExecutionsByWorkflow,
  getExecutionById,
  getExecutionMetrics,
} from "../services/execution-service"
import { isValidObjectId } from "../utils"

export async function fetchExecutions(userId: string, limit = 20) {
  return getExecutions(userId, limit)
}

export async function fetchExecutionsByWorkflow(workflowId: string, userId: string, limit = 20) {
  if (!isValidObjectId(workflowId)) {
    return []
  }

  return getExecutionsByWorkflow(workflowId, userId, limit)
}

export async function fetchExecutionById(id: string, userId: string) {
  if (!isValidObjectId(id)) {
    return { error: "Invalid execution ID format" }
  }

  const execution = await getExecutionById(id, userId)
  if (!execution) {
    return { error: "Execution not found" }
  }

  return { execution }
}

export async function fetchExecutionMetrics(userId: string, days = 30) {
  return getExecutionMetrics(userId, days)
}
