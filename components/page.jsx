"use client"
import { useSearchParams } from "next/navigation"
import VideoPlayer from "@/components/player/VideoPlayer"
import { Suspense } from 'react';
import Home from "@/components/home";

export default function HomePage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id") || "";

  if (!id) {
   return (
     <Home />
   )
 }

  return (
    <Suspense className="min-h-screen bg-slate-900 flex items-center justify-center">
     <VideoPlayer/>
    </Suspense>
  )
}
