'use client'

import Link from 'next/link'
import { Calendar, MapPin, ArrowRight, CheckCircle } from 'lucide-react'

export default function OpportunityCard({ opportunity, applied = false }) {
  const isDeadlineSoon = opportunity.deadline && new Date(opportunity.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-foreground flex-1">{opportunity.title}</h3>
        {applied && (
          <div className="flex items-center gap-1 bg-success bg-opacity-10 text-success px-2 py-1 rounded text-xs font-medium">
            <CheckCircle className="w-4 h-4" />
            Applied
          </div>
        )}
      </div>

      <p className="text-secondary text-sm mb-4 line-clamp-2">{opportunity.description}</p>

      <div className="space-y-2 mb-4">
        {opportunity.category && (
          <div className="inline-block bg-muted text-foreground text-xs font-medium px-3 py-1 rounded-full">
            {opportunity.category}
          </div>
        )}
        {opportunity.location && (
          <div className="flex items-center gap-2 text-sm text-secondary">
            <MapPin className="w-4 h-4" />
            {opportunity.location}
          </div>
        )}
        {opportunity.deadline && (
          <div className={`flex items-center gap-2 text-sm ${isDeadlineSoon ? 'text-danger font-medium' : 'text-secondary'}`}>
            <Calendar className="w-4 h-4" />
            Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
            {isDeadlineSoon && <span className="text-xs">(Soon!)</span>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/opportunities/${opportunity.id}`}
          className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
