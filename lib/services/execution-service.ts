import { ObjectId } from "mongodb"
import clientPromise from "../mongodb"
import type { Execution, ExecutionWithId, ExecutionLog } from "../models/execution"
import { isValidObjectId } from "@/lib/utils"

export async function getExecutions(userId: string, limit = 20): Promise<ExecutionWithId[]> {
  try {
    if (!isValidObjectId(userId)) {
      return []
    }

    const client = await clientPromise
    const collection = client.db("autoagentx").collection<Execution>("executions")

    return collection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray() as Promise<ExecutionWithId[]>
  } catch (error) {
    console.error("Error getting executions:", error)
    return []
  }
}

export async function getExecutionsByWorkflow(
  workflowId: string,
  userId: string,
  limit = 20,
): Promise<ExecutionWithId[]> {
  try {
    if (!isValidObjectId(workflowId) || !isValidObjectId(userId)) {
      return []
    }

    const client = await clientPromise
    const collection = client.db("autoagentx").collection<Execution>("executions")

    return collection
      .find({
        workflowId: new ObjectId(workflowId),
        userId: new ObjectId(userId),
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray() as Promise<ExecutionWithId[]>
  } catch (error) {
    console.error("Error getting executions by workflow:", error)
    return []
  }
}

export async function getExecutionById(id: string, userId: string): Promise<ExecutionWithId | null> {
  try {
    if (!isValidObjectId(id) || !isValidObjectId(userId)) {
      return null
    }

    const client = await clientPromise
    const collection = client.db("autoagentx").collection<Execution>("executions")

    return collection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId),
    }) as Promise<ExecutionWithId | null>
  } catch (error) {
    console.error("Error getting execution by ID:", error)
    return null
  }
}

export async function createExecution(execution: Execution): Promise<ExecutionWithId> {
  try {
    const client = await clientPromise
    const collection = client.db("autoagentx").collection<Execution>("executions")

    const now = new Date()
    const newExecution = {
      ...execution,
      createdAt: now,
      updatedAt: now,
    }

    const result = await collection.insertOne(newExecution)
    return { ...newExecution, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating execution:", error)
    throw error
  }
}

export async function updateExecution(id: string, update: Partial<Execution>): Promise<ExecutionWithId | null> {
  try {
    if (!isValidObjectId(id)) {
      return null
    }

    const client = await clientPromise
    const collection = client.db("autoagentx").collection<Execution>("executions")

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...update, updatedAt: new Date() } },
      { returnDocument: "after" },
    )

    return result as unknown as ExecutionWithId | null
  } catch (error) {
    console.error("Error updating execution:", error)
    return null
  }
}

export async function addExecutionLog(id: string, log: ExecutionLog): Promise<boolean> {
  try {
    if (!isValidObjectId(id)) {
      return false
    }

    const client = await clientPromise
    const collection = client.db("autoagentx").collection<Execution>("executions")

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { logs: log },
        $set: { updatedAt: new Date() },
      },
    )

    return result.modifiedCount === 1
  } catch (error) {
    console.error("Error adding execution log:", error)
    return false
  }
}

export async function getExecutionMetrics(userId: string, days = 30): Promise<any> {
  try {
    if (!isValidObjectId(userId)) {
      return []
    }

    const client = await clientPromise
    const collection = client.db("autoagentx").collection<Execution>("executions")

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const metrics = await collection
      .aggregate([
        {
          $match: {
            userId: new ObjectId(userId),
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            count: { $sum: 1 },
            successCount: {
              $sum: {
                $cond: [{ $eq: ["$status", "Completed"] }, 1, 0],
              },
            },
            failureCount: {
              $sum: {
                $cond: [{ $eq: ["$status", "Failed"] }, 1, 0],
              },
            },
            avgDuration: { $avg: "$metrics.duration" },
            totalTokens: { $sum: "$metrics.tokenUsage.total" },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1,
          },
        },
      ])
      .toArray()

    return metrics
  } catch (error) {
    console.error("Error getting execution metrics:", error)
    return []
  }
}
