import type { ObjectId } from "mongodb"

export interface Agent {
  _id?: ObjectId
  userId: ObjectId
  name: string
  description: string
  model: string
  systemPrompt: string
  tools: AgentTool[]
  memory: MemoryConfig
  status: "Draft" | "Active" | "Archived"
  createdAt: Date
  updatedAt: Date
}

export interface AgentTool {
  id: string
  name: string
  description: string
  parameters: Record<string, any>
}

export interface MemoryConfig {
  type: "buffer" | "conversation" | "vector"
  capacity: number
}

export interface AgentWithId extends Agent {
  _id: ObjectId
}
