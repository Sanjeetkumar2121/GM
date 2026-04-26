'use client'

import { X, Check, AlertCircle, Info } from 'lucide-react'

export default function Toast({ message, type = 'info', onClose }) {
  const typeStyles = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-primary text-white',
  }

  const typeIcons = {
    success: <Check className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-pulse ${typeStyles[type]}`}
      role="alert"
    >
      {typeIcons[type]}
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-80 transition-opacity"
        aria-label="Close toast"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}
