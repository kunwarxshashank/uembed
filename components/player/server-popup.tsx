"use client"

import { Cloud, Check } from "lucide-react"

interface ServerPopupProps {
  servers: Array<{ title: string }>
  onServerSelect: (index: number) => void
  onClose: () => void
  selected?: number
}

export default function ServerPopup({
  servers,
  onServerSelect,
  onClose,
  selected = 0,
}: ServerPopupProps) {

return (
    <div className="fixed bottom-4 sm:bottom-24 mb-2 sm:mb-8 right-2 sm:right-10 z-[1500] max-w-full w-[95%] sm:w-[350px]">
      <div className="relative bg-[#181A20]/95 backdrop-blur-xl rounded-2xl shadow-2xl px-3 py-4 sm:px-6 sm:py-6 border border-white/10">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 sm:top-3 right-3 sm:right-4 text-gray-400 hover:text-white rounded-full px-2 py-1 text-sm sm:text-base font-semibold tracking-wide"
          aria-label="Close"
          style={{ background: "transparent", opacity: "0.8" }}
        >
          CLOSE
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <div>
              <div className="text-sm sm:text-base font-semibold text-white">Select Source</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Choose your preferred server</div>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 mb-3 sm:mb-4"></div>
        {/* Server list */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {servers.map((server, idx) => (
            <button
              key={idx}
              onClick={() => onServerSelect(idx)}
              className={`flex flex-col items-center px-2 sm:px-3 py-2 sm:py-3 rounded-2xl border transition-all relative font-medium
                ${
                  idx === selected
                    ? "bg-[#23263a] border-blue-500 shadow-lg ring-2 ring-blue-400"
                    : "bg-[#181A20] border-white/10 hover:bg-white/10"
                }
              `}
            >
              <div className="relative mb-1">
                <Cloud
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    idx === selected ? "text-blue-400" : "text-gray-400"
                  }`}
                />
                <span
                  className={`absolute -top-2 -right-2 rounded-full bg-black/80 p-0.5 sm:p-1 ${
                    idx === selected ? "text-blue-400" : "text-green-400 opacity-80"
                  }`}
                >
                  <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                </span>
              </div>
              <span
                className={`capitalize font-medium text-xs sm:text-sm ${
                  idx === selected ? "text-white" : "text-gray-200"
                }`}
              >
                {server.title}
              </span>
              <span 
                className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 font-semibold ${
                  idx === selected ? "text-blue-400" : "text-green-400"
                }`}
              >
                AVAILABLE
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}