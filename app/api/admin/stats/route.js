import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export const dynamic = "force-dynamic"
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

// GET - Fetch admin stats
export async function GET(request) {
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
    const videos = db.collection("videos")
    const requests = db.collection("requests")

    // Check if user is admin
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) })
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Get stats
    const totalUsers = await users.countDocuments()
    const totalVideos = await videos.countDocuments()
    const totalRequests = await requests.countDocuments()
    const pendingRequests = await requests.countDocuments({ status: "pending" })

    // Get total views
    const videosWithViews = await videos.find({}, { projection: { views: 1 } }).toArray()
    const totalViews = videosWithViews.reduce((sum, video) => sum + (video.views || 0), 0)

    return NextResponse.json({
      stats: {
        totalUsers,
        totalVideos,
        totalViews,
        totalRequests,
        pendingRequests,
      },
    })
  } catch (error) {
    console.error("Fetch admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
