import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password?: string // Hashed password
  image?: string
  apiKeys?: {
    openai?: string
    anthropic?: string
    pinecone?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface UserWithId extends User {
  _id: ObjectId
}
