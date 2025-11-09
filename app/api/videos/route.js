import { NextResponse } from "next/server"
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

// GET - Fetch user's videos
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
    const videos = db.collection("videos")

    // Get user's videos
    const userVideos = await videos.find({ userId: decoded.userId }).toArray()

    return NextResponse.json({
      videos: userVideos.map((video) => ({
        ...video,
        id: video._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Fetch videos error:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}

// POST - Upload new video
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

    const { title, description, tags, videoUrl } = await request.json()

    if (!title || !videoUrl) {
      return NextResponse.json({ error: "Title and video URL are required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("uembed")
    const videos = db.collection("videos")

    // Create video document
    const videoData = {
      userId: decoded.userId,
      title,
      description: description || "",
      tags: tags || "",
      videoUrl,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Insert video into database
    const result = await videos.insertOne(videoData)

    return NextResponse.json({
      video: {
        id: result.insertedId.toString(),
        ...videoData,
      },
    })
  } catch (error) {
    console.error("Upload video error:", error)
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 })
  }
}
