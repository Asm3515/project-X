"use server"

import { getAgents, getAgentById, updateAgent, deleteAgent } from "../services/agent-service"
import { isValidObjectId } from "../utils"

export async function fetchAgents(userId: string) {
  return getAgents(userId)
}

export async function fetchAgentById(id: string, userId: string) {
  if (!isValidObjectId(id)) {
    return { error: "Invalid agent ID format" }
  }

  const agent = await getAgentById(id, userId)
  if (!agent) {
    return { error: "Agent not found" }
  }

  return { agent }
}

export async function saveAgent(id: string, userId: string, data: any) {
  if (!isValidObjectId(id)) {
    return { error: "Invalid agent ID format" }
  }

  const agent = await updateAgent(id, userId, data)
  if (!agent) {
    return { error: "Agent not found" }
  }

  return { agent }
}

export async function removeAgent(id: string, userId: string) {
  if (!isValidObjectId(id)) {
    return { error: "Invalid agent ID format" }
  }

  const success = await deleteAgent(id, userId)
  if (!success) {
    return { error: "Agent not found" }
  }

  return { success: true }
}
