"use client"

import { useState } from "react"
import { ChevronDown, Globe, Check } from "lucide-react"

interface StreamOptionsProps {
  streams: any[]
  onStreamChange: (index: number) => void
  currentIndex?: number
}

export default function StreamOptions({ 
  streams, 
  onStreamChange,
  currentIndex = 0 
}: StreamOptionsProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  if (!streams || streams.length <= 1) return null

  return (
    <div className="absolute top-2 right-5 z-50">
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 bg-black/40 hover:bg-black/60 text-white px-2 py-1.5 
            rounded-xl backdrop-blur-md border border-white/10 transition-all duration-200 
            shadow-lg hover:shadow-black/20"
        >
          <Globe className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium">Language</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 
            ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 bg-[#181A20]/95 backdrop-blur-xl 
            rounded-xl overflow-hidden w-48 border border-white/10 shadow-xl">
            <div className="py-2">
              {streams.map((stream, index) => (
                <button
                  key={index}
                  className={`flex items-center justify-between w-full px-4 py-2.5 text-left
                    hover:bg-white/5 transition-colors ${currentIndex === index ? 'bg-blue-500/10' : ''}`}
                  onClick={() => {
                    onStreamChange(index)
                    setShowDropdown(false)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Globe 
                      className={`w-4 h-4 ${
                        currentIndex === index ? 'text-blue-400' : 'text-gray-400'
                      }`} 
                    />
                    <span className={`text-sm font-medium ${
                      currentIndex === index ? 'text-white' : 'text-gray-300'
                    }`}>
                      {stream.title || `Quality ${index + 1}`}
                    </span>
                  </div>
                  {currentIndex === index && (
                    <Check className="w-4 h-4 text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}