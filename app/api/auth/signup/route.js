import { NextResponse } from "next/server"
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

// Simple JWT-like token creation
function createToken(payload) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payloadStr = btoa(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }))
  const signature = btoa(JSON.stringify({ signature: "simple" }))
  return `${header}.${payloadStr}.${signature}`
}

export async function POST(request) {
  try {
    const { email, password, username, website, telegram } = await request.json()

    if (!email || !password || !username || !website || !telegram) {
      return NextResponse.json({ error: "All values are required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("uembed")
    const users = db.collection("users")

    // Check if user already exists
    const existingEmailUser = await users.findOne({ email })
    const existingUsernameUser = await users.findOne({ username })

    if (existingEmailUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    if (existingUsernameUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate API key
    const apiKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Create user document
    const userData = {
      email,
      username,
      password: hashedPassword,
      website,
      telegram,
      apiKey,
      totalrequest: "0",
      role: "user", // Add role field
      premium: false,
      playerSettings: {
        adstype: "popup",
        playerColor: "#ff0000",
        subtitlesColor: "#ffffff",
        subtitlesAutoPlay: false,
        defaultSubtitlesLanguage: "en",
        defaultAudioTrackLanguage: "en",
        defaultServer: "0",
        playerWatermark: false,
        playerLogoLink: "",
        allowedEmbedDomains: "",
        refererList: "",
        bannedIPs: "",
        blockDirect: true,
        sandboxDetect: true,
        adblockDetect: false,
        devtoolDetect: true,
      },
      createdAt: new Date().toISOString(),
    }

    // Insert user into database
    const result = await users.insertOne(userData)

    // Generate token
    const token = createToken({ userId: result.insertedId.toString(), email })

    // Remove password from user data
    const { password: _, ...userWithoutPassword } = userData

    return NextResponse.json({
      token,
      user: {
        id: result.insertedId.toString(),
        ...userWithoutPassword,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
