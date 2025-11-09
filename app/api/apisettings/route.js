import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { useAuth } from "@/contexts/auth-context"


export async function POST(request) {
  try {
    const { apikey } = await request.json()
    if (!apikey) {
      return NextResponse.json({ error: "API key required" }, { status: 400 })
    }

    // Database configuration 
    const client = await clientPromise
    const db = client.db("uembed")
    const users = db.collection("users") 
    const apiLogs = db.collection("api_logs")
    const userdata = await users.findOne({ apiKey: apikey })
    const logs = await apiLogs.findOne({apikey: apikey})


    // Get IP address and embedurl from request
    const ip = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const referer = request.headers.get("Referer");

    
    // Log the API request
    await logApiRequest(apikey, ip, referer)


    if (!userdata) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove sensitive info
    const { password, ...userSafe } = userdata

    return NextResponse.json({
      logs,
      playerSettings: userSafe.playerSettings || {},
      user: {
        email: userSafe.email,
        username: userSafe.username,
        role: userSafe.role,
        totalrequest: userSafe.totalrequest
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}



async function logApiRequest(apikey, ip, referer) {
  const client = await clientPromise
  const db = client.db("uembed")
  const apiLogs = db.collection("api_logs")

  // Only store if less than 10,000 requests
  // Store apikey, ip, and timestamp

  const count = await apiLogs.countDocuments()
  if (count >= 1000) return
  await apiLogs.insertOne({
    apikey,
    ip,
    referer,
    timestamp: new Date().toISOString(),
  })
}
