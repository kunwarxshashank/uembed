import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request) {
  try {
    const client = await clientPromise
    const db = client.db("uembed")
    const apiLogs = db.collection("api_logs")

    // Aggregate logs by apikey, show IP and geolocation
    const logs = await apiLogs.aggregate([
      { $sort: { timestamp: -1 } },
      { $limit: 10000 }, // Only consider the latest 10,000 logs
      {
        $group: {
          _id: { apikey: "$apikey", ip: "$ip" },
          count: { $sum: 1 },
          lastRequest: { $last: "$timestamp" },
        },
      },
      {
        $group: {
          _id: "$_id.apikey",
          requests: {
            $push: {
              ip: "$_id.ip",
              count: "$count",
              geo: "$geo",
              lastRequest: "$lastRequest",
            },
          },
          total: { $sum: "$count" },
        },
      },
      {
        $project: {
          apikey: "$_id",
          requests: 1,
          total: 1,
          _id: 0,
        },
      },
    ]).toArray()

    return NextResponse.json({ logs })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch API logs" }, { status: 500 })
  }
} 