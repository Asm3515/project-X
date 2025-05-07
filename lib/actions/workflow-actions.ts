"use server"

import { getWorkflows, getWorkflowById, updateWorkflow, deleteWorkflow } from "../services/workflow-service"
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

export async function saveWorkflow(id: string, userId: string, data: any) {
  if (!isValidObjectId(id)) {
    return { error: "Invalid workflow ID format" }
  }

  const workflow = await updateWorkflow(id, userId, data)
  if (!workflow) {
    return { error: "Workflow not found" }
  }

  return { workflow }
}

export async function removeWorkflow(id: string, userId: string) {
  if (!isValidObjectId(id)) {
    return { error: "Invalid workflow ID format" }
  }

  const success = await deleteWorkflow(id, userId)
  if (!success) {
    return { error: "Workflow not found" }
  }

  return { success: true }
}
