'use client'

import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ fullPage = false, message = 'Loading...' }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-secondary text-sm font-medium">{message}</p>
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {spinner}
      </div>
    )
  }

  return spinner
}
