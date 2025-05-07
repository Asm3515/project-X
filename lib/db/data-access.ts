// This file should only be imported by server components or API routes
import { ObjectId } from "mongodb"
import clientPromise from "./mongodb-client"
import { isValidObjectId } from "../utils"

// Workflows
export async function getWorkflows(userId: string) {
  if (!isValidObjectId(userId)) {
    return []
  }

  try {
    const client = await clientPromise
    const collection = client.db("autoagentx").collection("workflows")
    return collection
      .find({ userId: new ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .toArray()
  } catch (error) {
    console.error("Error getting workflows:", error)
    return []
  }
}

export async function getWorkflowById(id: string, userId: string) {
  if (!isValidObjectId(id) || !isValidObjectId(userId)) {
    return null
  }

  try {
    const client = await clientPromise
    const collection = client.db("autoagentx").collection("workflows")
    return collection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId),
    })
  } catch (error) {
    console.error("Error getting workflow by ID:", error)
    return null
  }
}

// Agents
export async function getAgents(userId: string) {
  if (!isValidObjectId(userId)) {
    return []
  }

  try {
    const client = await clientPromise
    const collection = client.db("autoagentx").collection("agents")
    return collection
      .find({ userId: new ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .toArray()
  } catch (error) {
    console.error("Error getting agents:", error)
    return []
  }
}

// Executions
export async function getExecutions(userId: string, limit = 20) {
  if (!isValidObjectId(userId)) {
    return []
  }

  try {
    const client = await clientPromise
    const collection = client.db("autoagentx").collection("executions")
    return collection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
  } catch (error) {
    console.error("Error getting executions:", error)
    return []
  }
}

export async function getExecutionMetrics(userId: string, days = 30) {
  if (!isValidObjectId(userId)) {
    return []
  }

  try {
    const client = await clientPromise
    const collection = client.db("autoagentx").collection("executions")

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    return collection
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
  } catch (error) {
    console.error("Error getting execution metrics:", error)
    return []
  }
}
