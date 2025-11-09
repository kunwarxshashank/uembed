"use client"

interface PlayerControlsProps {
  onServerChange: () => void
}

export default function PlayerControls({ onServerChange }: PlayerControlsProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-between">
      <button
        onClick={onServerChange}
        className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
      >
        <img src="/assets/cloud.png" alt="Server" className="w-3 h-3" />
        Change Server
      </button>
    </div>
  )
}
