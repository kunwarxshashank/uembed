"use client"
import HomePage from "@/components/page"
import { Suspense } from 'react';

export default function Main() {

  return (
    <Suspense>
    <HomePage/>
    </Suspense>
  )
}
