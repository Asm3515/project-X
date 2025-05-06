import type { ObjectId } from "mongodb"
import type { Node, Edge } from "reactflow"

export interface Workflow {
  _id?: ObjectId
  userId: ObjectId
  name: string
  description: string
  status: "Draft" | "Active" | "Archived"
  nodes: Node[]
  edges: Edge[]
  settings: {
    defaultModel: string
    timeout: number
    memory: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowWithId extends Workflow {
  _id: ObjectId
}
