"use client"

interface ResumeToastProps {
  time: number
  onYes: () => void
  onNo: () => void
}

export default function ResumeToast({ time, onYes, onNo }: ResumeToastProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[2000] px-4 bg-black/40">
      <div 
        className="bg-[#1a1c25]/80 backdrop-blur-xl shadow-2xl text-white 
          p-6 sm:p-8 rounded-2xl w-[360px] max-w-full text-center 
          border border-white/10 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex flex-col items-center">
          {/* Play Icon */}
          <div className="relative mb-4 group">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl 
              group-hover:bg-red-500/30 transition-colors duration-300" 
            />
            <div className="relative w-14 h-14 flex items-center justify-center 
              bg-[#2c2f45]/80 rounded-full border border-red-400/30"
            >
              <svg 
                width={28} 
                height={28} 
                fill="none" 
                viewBox="0 0 24 24" 
                className="text-red-400"
              >
                <circle 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="transparent"
                />
                <polygon 
                  points="10,8 16,12 10,16" 
                  fill="currentColor" 
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white/90">
            Resume Playback?
          </h3>
          <p className="text-sm sm:text-base text-gray-300 mb-6">
            Continue watching from{" "}
            <span className="font-mono text-red-400 font-medium">
              {formatTime(time)}
            </span>
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={onYes}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 
                border border-red-500/30 font-medium py-2.5 px-4 rounded-xl 
                transition-all duration-200 hover:scale-[1.02] focus:scale-[0.98]"
            >
              Yes, Resume
            </button>
            <button
              onClick={onNo}
              className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 
                border border-white/10 font-medium py-2.5 px-4 rounded-xl 
                transition-all duration-200 hover:scale-[1.02] focus:scale-[0.98]"
            >
              No, Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}