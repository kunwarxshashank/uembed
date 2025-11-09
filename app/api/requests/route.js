import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

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

// GET - Fetch user's requests or all requests for admin
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
    const requests = db.collection("requests")
    const users = db.collection("users")

    // Get user to check role
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) })

    let userRequests
    if (user.role === "admin") {
      // Admin can see all requests with user info
      // Handle both string and ObjectId userId formats
      userRequests = await requests
        .aggregate([
          {
            $addFields: {
              userObjectId: {
                $cond: {
                  if: { $type: "$userId" },
                  then: {
                    $cond: {
                      if: { $eq: [{ $type: "$userId" }, "string"] },
                      then: { $toObjectId: "$userId" },
                      else: "$userId",
                    },
                  },
                  else: { $toObjectId: "$userId" },
                },
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userObjectId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              type: 1,
              status: 1,
              createdAt: 1,
              "user.username": 1,
              "user.email": 1,
            },
          },
        ])
        .toArray()
    } else {
      // Regular users can only see their own requests
      // Try both string and ObjectId formats
      const userIdString = decoded.userId
      const userIdObject = new ObjectId(decoded.userId)

      userRequests = await requests
        .find({
          $or: [{ userId: userIdString }, { userId: userIdObject }],
        })
        .toArray()
    }

    return NextResponse.json({
      requests: userRequests.map((req) => ({
        ...req,
        id: req._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Fetch requests error:", error)
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
  }
}

// POST - Create new request
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

    const { title, description, type } = await request.json()

    if (!title || !description || !type) {
      return NextResponse.json({ error: "Title, description, and type are required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("uembed")
    const requests = db.collection("requests")

    // Create request document with ObjectId userId
    const requestData = {
      userId: new ObjectId(decoded.userId),
      title,
      description,
      type, // 'content' or 'feature'
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // Insert request into database
    const result = await requests.insertOne(requestData)

    return NextResponse.json({
      request: {
        id: result.insertedId.toString(),
        ...requestData,
        userId: decoded.userId, // Return as string for frontend
      },
    })
  } catch (error) {
    console.error("Create request error:", error)
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 })
  }
}
