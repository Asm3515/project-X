import type { ObjectId } from "mongodb"

export interface Execution {
  _id?: ObjectId
  workflowId: ObjectId
  userId: ObjectId
  status: "Running" | "Completed" | "Failed"
  input: string
  output?: string
  logs: ExecutionLog[]
  metrics: {
    startTime: Date
    endTime?: Date
    duration?: number
    tokenUsage?: {
      prompt: number
      completion: number
      total: number
    }
    cost?: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface ExecutionLog {
  timestamp: Date
  level: "info" | "warning" | "error"
  message: string
  nodeId?: string
  data?: any
}

export interface ExecutionWithId extends Execution {
  _id: ObjectId
}
