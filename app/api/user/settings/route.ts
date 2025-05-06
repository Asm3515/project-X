import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserById, updateUser } from "@/lib/services/user-service"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserById(session.user.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Don't return sensitive information
    const { _id, name, email, image, createdAt, updatedAt } = user

    return NextResponse.json({
      id: _id,
      name,
      email,
      image,
      createdAt,
      updatedAt,
      hasApiKeys: !!user.apiKeys && Object.keys(user.apiKeys).length > 0,
    })
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return NextResponse.json({ error: "Failed to fetch user settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Only allow updating certain fields
    const allowedFields = ["name", "image"]
    const updateData: Record<string, any> = {}

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field]
      }
    }

    const user = await updateUser(session.user.id, updateData)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Don't return sensitive information
    const { _id, name, email, image, createdAt, updatedAt } = user

    return NextResponse.json({
      id: _id,
      name,
      email,
      image,
      createdAt,
      updatedAt,
      hasApiKeys: !!user.apiKeys && Object.keys(user.apiKeys).length > 0,
    })
  } catch (error) {
    console.error("Error updating user settings:", error)
    return NextResponse.json({ error: "Failed to update user settings" }, { status: 500 })
  }
}
