import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from "uuid"
import { ObjectId } from "mongodb"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return uuidv4()
}

// Add a function to validate MongoDB ObjectIds
export function isValidObjectId(id: string): boolean {
  if (!id || typeof id !== "string") {
    return false
  }

  // Check if the string is a valid 24-character hex string
  return /^[0-9a-fA-F]{24}$/.test(id)
}

// Convert string to ObjectId with validation
export function toObjectId(id: string): ObjectId {
  if (!isValidObjectId(id)) {
    throw new Error(`Invalid ObjectId: ${id}`)
  }
  return new ObjectId(id)
}
