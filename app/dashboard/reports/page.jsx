"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function ReportsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/reports/apikey-usage")
      .then(res => res.json())
      .then(data => {
        setLogs(data.logs || [])
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <span className="text-lg text-muted-foreground">Loading...</span>
    </div>
  )

  // Calculate total requests across all apikeys
 const totalRequests = Math.round(
  logs.reduce((sum, log) => sum + (log.total || 0) / 2, 0)
);


  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-white">
        <BarChart3 className="w-8 h-8 text-blue-400" />
        API Key Usage Reports
      </h1>

      {/* Card View for Total Requests */}
      <Card className="mb-8 bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-300">Total API Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-white">{totalRequests}</div>
        </CardContent>
      </Card>

      {/* Table View for Details */}
      {logs.map(log => (
        <Card key={log.apikey} className="mb-8 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-blue-200 break-all">
              API Key: <span className="font-mono">{log.apikey || <span className="italic text-gray-400">Unknown</span>}</span>
            </CardTitle>
            <div className="text-sm text-slate-400">Total Requests: {totalRequests}</div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-[600px] w-full text-sm text-left text-slate-300">
              <thead>
                <tr className="bg-slate-700 text-slate-200">
                  <th className="px-4 py-2">IP</th>
                  <th className="px-4 py-2">Country</th>
                  <th className="px-4 py-2">Region</th>
                  <th className="px-4 py-2">City</th>
                  <th className="px-4 py-2">ISP</th>
                  <th className="px-4 py-2">Requests</th>
                  <th className="px-4 py-2">Last Request</th>
                </tr>
              </thead>
              <tbody>
                {log.requests.map((req, i) => (
                  <tr key={i} className="hover:bg-slate-700 transition">
                    <td className="px-4 py-2 font-mono">{req.ip}</td>
                    <td className="px-4 py-2">
                      {req.geo?.status === "success" ? req.geo.country : <span className="text-gray-400">Unknown</span>}
                    </td>
                    <td className="px-4 py-2">
                      {req.geo?.status === "success" ? req.geo.regionName : <span className="text-gray-400">Unknown</span>}
                    </td>
                    <td className="px-4 py-2">
                      {req.geo?.status === "success" ? req.geo.city : <span className="text-gray-400">Unknown</span>}
                    </td>
                    <td className="px-4 py-2">
                      {req.geo?.status === "success" ? req.geo.isp : <span className="text-gray-400">Unknown</span>}
                    </td>
                    <td className="px-4 py-2">{totalRequests}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{new Date(req.lastRequest).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
