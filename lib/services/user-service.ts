import { ObjectId } from "mongodb"
import clientPromise from "../mongodb"
import type { User, UserWithId } from "../models/user"
import bcrypt from "bcryptjs"

export async function getUserByEmail(email: string): Promise<UserWithId | null> {
  try {
    const client = await clientPromise
    const collection = client.db("autoagentx").collection<User>("users")
    return collection.findOne({ email }) as Promise<UserWithId | null>
  } catch (error) {
    console.error("Error getting user by email:", error)
    throw error
  }
}

export async function getUserById(id: string): Promise<UserWithId | null> {
  try {
    const client = await clientPromise
    const collection = client.db("autoagentx").collection<User>("users")
    return collection.findOne({ _id: new ObjectId(id) }) as Promise<UserWithId | null>
  } catch (error) {
    console.error("Error getting user by ID:", error)
    throw error
  }
}

export async function createUser(userData: Partial<User> & { password: string }): Promise<UserWithId> {
  try {
    const client = await clientPromise
    const collection = client.db("autoagentx").collection<User>("users")

    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    const now = new Date()
    const newUser = {
      name: userData.name || "User",
      email: userData.email!,
      password: hashedPassword,
      image: userData.image,
      apiKeys: userData.apiKeys || {},
      createdAt: now,
      updatedAt: now,
    } as User

    const result = await collection.insertOne(newUser)

    // Don't return the password in the response
    const { password, ...userWithoutPassword } = newUser
    return { ...userWithoutPassword, _id: result.insertedId } as UserWithId
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function updateUser(id: string, update: Partial<User>): Promise<UserWithId | null> {
  try {
    const client = await clientPromise
    const collection = client.db("autoagentx").collection<User>("users")

    // If updating password, hash it
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10)
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...update, updatedAt: new Date() } },
      { returnDocument: "after" },
    )

    // Don't return the password in the response
    if (result && result.password) {
      const { password, ...userWithoutPassword } = result
      return userWithoutPassword as unknown as UserWithId
    }

    return result as unknown as UserWithId | null
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export async function updateApiKeys(userId: string, apiKeys: Record<string, string>): Promise<UserWithId | null> {
  try {
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

    // Don't return the password in the response
    if (result && result.password) {
      const { password, ...userWithoutPassword } = result
      return userWithoutPassword as unknown as UserWithId
    }

    return result as unknown as UserWithId | null
  } catch (error) {
    console.error("Error updating API keys:", error)
    throw error
  }
}

// Add a function to verify passwords
export async function verifyPassword(user: UserWithId, password: string): Promise<boolean> {
  if (!user.password) return false
  return bcrypt.compare(password, user.password)
}
