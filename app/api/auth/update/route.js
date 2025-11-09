import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

// Simple hash function using built-in crypto
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// Simple JWT-like token verification
function verifyToken(token) {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const payload = JSON.parse(atob(parts[1]))

    // Check if token is expired
    if (payload.exp < Date.now()) return null

    return payload
  } catch (error) {
    return null
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const updateData = await request.json()

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password)
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("uembed")
    const users = db.collection("users")

    // Update user document
    await users.updateOne({ _id: new ObjectId(decoded.userId) }, { $set: updateData })

    // Get updated user data
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) })
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        ...userWithoutPassword,
      },
    })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
