import { ObjectId } from "mongodb"
import clientPromise from "../mongodb"
import type { Workflow, WorkflowWithId } from "../models/workflow"

export async function getWorkflows(userId: string): Promise<WorkflowWithId[]> {
  const client = await clientPromise
  const collection = client.db("autoagentx").collection<Workflow>("workflows")

  return collection
    .find({ userId: new ObjectId(userId) })
    .sort({ updatedAt: -1 })
    .toArray() as Promise<WorkflowWithId[]>
}

export async function getWorkflowById(id: string, userId: string): Promise<WorkflowWithId | null> {
  const client = await clientPromise
  const collection = client.db("autoagentx").collection<Workflow>("workflows")

  return collection.findOne({
    _id: new ObjectId(id),
    userId: new ObjectId(userId),
  }) as Promise<WorkflowWithId | null>
}

export async function createWorkflow(workflow: Workflow): Promise<WorkflowWithId> {
  const client = await clientPromise
  const collection = client.db("autoagentx").collection<Workflow>("workflows")

  const now = new Date()
  const newWorkflow = {
    ...workflow,
    createdAt: now,
    updatedAt: now,
  }

  const result = await collection.insertOne(newWorkflow)
  return { ...newWorkflow, _id: result.insertedId }
}

export async function updateWorkflow(
  id: string,
  userId: string,
  update: Partial<Workflow>,
): Promise<WorkflowWithId | null> {
  const client = await clientPromise
  const collection = client.db("autoagentx").collection<Workflow>("workflows")

  const result = await collection.findOneAndUpdate(
    {
      _id: new ObjectId(id),
      userId: new ObjectId(userId),
    },
    { $set: { ...update, updatedAt: new Date() } },
    { returnDocument: "after" },
  )

  return result as unknown as WorkflowWithId | null
}

export async function deleteWorkflow(id: string, userId: string): Promise<boolean> {
  const client = await clientPromise
  const collection = client.db("autoagentx").collection<Workflow>("workflows")

  const result = await collection.deleteOne({
    _id: new ObjectId(id),
    userId: new ObjectId(userId),
  })

  return result.deletedCount === 1
}
