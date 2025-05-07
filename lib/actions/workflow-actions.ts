"use server"

import { getWorkflows, getWorkflowById } from "../db/data-access"
import { isValidObjectId } from "../utils"

export async function fetchWorkflows(userId: string) {
  return getWorkflows(userId)
}

export async function fetchWorkflowById(id: string, userId: string) {
  if (!isValidObjectId(id)) {
    return { error: "Invalid workflow ID format" }
  }

  const workflow = await getWorkflowById(id, userId)
  if (!workflow) {
    return { error: "Workflow not found" }
  }

  return { workflow }
}
