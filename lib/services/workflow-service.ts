import { ObjectId } from "mongodb"
import clientPromise from "../mongodb"
import type { Workflow, WorkflowWithId } from "../models/workflow"
import { isValidObjectId } from "../utils"

export async function getWorkflows(userId: string): Promise<WorkflowWithId[]> {
  try {
    if (!isValidObjectId(userId)) {
      return []
    }

    const client = await clientPromise
    const collection = client.db("autoagentx").collection<Workflow>("workflows")

    return collection
      .find({ userId: new ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .toArray() as Promise<WorkflowWithId[]>
  } catch (error) {
    console.error("Error getting workflows:", error)
    return []
  }
}

export async function getWorkflowById(id: string, userId: string): Promise<WorkflowWithId | null> {
  try {
    if (!isValidObjectId(id) || !isValidObjectId(userId)) {
      return null
    }

    const client = await clientPromise
    const collection = client.db("autoagentx").collection<Workflow>("workflows")

    return collection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId),
    }) as Promise<WorkflowWithId | null>
  } catch (error) {
    console.error("Error getting workflow by ID:", error)
    return null
  }
}

export async function createWorkflow(workflow: Workflow): Promise<WorkflowWithId> {
  try {
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
  } catch (error) {
    console.error("Error creating workflow:", error)
    throw error
  }
}

export async function updateWorkflow(
  id: string,
  userId: string,
  update: Partial<Workflow>,
): Promise<WorkflowWithId | null> {
  try {
    if (!isValidObjectId(id) || !isValidObjectId(userId)) {
      return null
    }

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
  } catch (error) {
    console.error("Error updating workflow:", error)
    return null
  }
}

export async function deleteWorkflow(id: string, userId: string): Promise<boolean> {
  try {
    if (!isValidObjectId(id) || !isValidObjectId(userId)) {
      return false
    }

    const client = await clientPromise
    const collection = client.db("autoagentx").collection<Workflow>("workflows")

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId),
    })

    return result.deletedCount === 1
  } catch (error) {
    console.error("Error deleting workflow:", error)
    return false
  }
}
