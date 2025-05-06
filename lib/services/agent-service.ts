import { ObjectId } from "mongodb"
import clientPromise from "../mongodb"
import type { Agent, AgentWithId } from "../models/agent"

export async function getAgents(userId: string): Promise<AgentWithId[]> {
  const client = await clientPromise
  const collection = client.db("autoagentx").collection<Agent>("agents")

  return collection
    .find({ userId: new ObjectId(userId) })
    .sort({ updatedAt: -1 })
    .toArray() as Promise<AgentWithId[]>
}

export async function getAgentById(id: string, userId: string): Promise<AgentWithId | null> {
  const client = await clientPromise
  const collection = client.db("autoagentx").collection<Agent>("agents")

  return collection.findOne({
    _id: new ObjectId(id),
    userId: new ObjectId(userId),
  }) as Promise<AgentWithId | null>
}

export async function createAgent(agent: Agent): Promise<AgentWithId> {
  const client = await clientPromise
  const collection = client.db("autoagentx").collection<Agent>("agents")

  const now = new Date()
  const newAgent = {
    ...agent,
    createdAt: now,
    updatedAt: now,
  }

  const result = await collection.insertOne(newAgent)
  return { ...newAgent, _id: result.insertedId }
}

export async function updateAgent(id: string, userId: string, update: Partial<Agent>): Promise<AgentWithId | null> {
  const client = await clientPromise
  const collection = client.db("autoagentx").collection<Agent>("agents")

  const result = await collection.findOneAndUpdate(
    {
      _id: new ObjectId(id),
      userId: new ObjectId(userId),
    },
    { $set: { ...update, updatedAt: new Date() } },
    { returnDocument: "after" },
  )

  return result as unknown as AgentWithId | null
}

export async function deleteAgent(id: string, userId: string): Promise<boolean> {
  const client = await clientPromise
  const collection = client.db("autoagentx").collection<Agent>("agents")

  const result = await collection.deleteOne({
    _id: new ObjectId(id),
    userId: new ObjectId(userId),
  })

  return result.deletedCount === 1
}
