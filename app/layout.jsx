import React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

export const metadata = {
  title: "Uembed - Video Streaming Platform",
  description: "Professional video streaming and hosting platform",
}



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

