"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Video } from "lucide-react"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    // Handle file drop
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-blue-500 bg-blue-500/10" : "border-slate-600 hover:border-slate-500"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Video className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Drop your video files here</h3>
            <p className="text-slate-400 mb-4">or click to browse files</p>
            <Button className="bg-blue-600 hover:bg-blue-700">Choose Files</Button>
            <p className="text-slate-500 text-sm mt-4">Supported formats: MP4, AVI, MOV, WMV (Max size: 2GB)</p>
          </div>

          {/* Video Details Form */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Video Title</Label>
              <Input placeholder="Enter video title" className="bg-slate-700 border-slate-600 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Description</Label>
              <Textarea
                placeholder="Enter video description"
                className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Tags</Label>
              <Input
                placeholder="Enter tags separated by commas"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">Upload Video</Button>
        </CardContent>
      </Card>
    </div>
  )
}
