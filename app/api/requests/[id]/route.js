import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

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

// PATCH - Update request status (admin only)
export async function PATCH(request, { params }) {
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

    const { status } = await request.json()

    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Valid status is required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("uembed")
    const users = db.collection("users")
    const requests = db.collection("requests")

    // Check if user is admin
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) })
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Update request status
    const result = await requests.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status, updatedAt: new Date().toISOString() } },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update request error:", error)
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 })
  }
}

// DELETE - Delete request (admin only)
export async function DELETE(request, { params }) {
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

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("uembed")
    const users = db.collection("users")
    const requests = db.collection("requests")

    // Check if user is admin
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) })
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Delete request
    const result = await requests.deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete request error:", error)
    return NextResponse.json({ error: "Failed to delete request" }, { status: 500 })
  }
}
