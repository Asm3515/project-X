import { ObjectId } from "mongodb"
import clientPromise from "../mongodb"
import type { User, UserWithId } from "../models/user"

export async function getUserByEmail(email: string): Promise<UserWithId | null> {
  const client = await clientPromise
  const collection = client.db("autoagentx").collection<User>("users")
  return collection.findOne({ email }) as Promise<UserWithId | null>
}

export async function getUserById(id: string): Promise<UserWithId | null> {
  const client = await clientPromise
  const collection = client.db("autoagentx").collection<User>("users")
  return collection.findOne({ _id: new ObjectId(id) }) as Promise<UserWithId | null>
}

export async function createUser(user: User): Promise<UserWithId> {
  const client = await clientPromise
  const collection = client.db("autoagentx").collection<User>("users")

  const now = new Date()
  const newUser = {
    ...user,
    createdAt: now,
    updatedAt: now,
  }

  const result = await collection.insertOne(newUser)
  return { ...newUser, _id: result.insertedId }
}

export async function updateUser(id: string, update: Partial<User>): Promise<UserWithId | null> {
  const client = await clientPromise
  const collection = client.db("autoagentx").collection<User>("users")

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...update, updatedAt: new Date() } },
    { returnDocument: "after" },
  )

  return result as unknown as UserWithId | null
}

export async function updateApiKeys(userId: string, apiKeys: Record<string, string>): Promise<UserWithId | null> {
  const client = await clientPromise
  const collection = client.db("autoagentx").collection<User>("users")

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $set: {
        apiKeys: apiKeys,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  )

  return result as unknown as UserWithId | null
}
