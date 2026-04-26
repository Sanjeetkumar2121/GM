'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import OpportunityCard from '@/components/OpportunityCard'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { apiService } from '@/lib/apiService'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [opportunities, setOpportunities] = useState([])
  const [appliedIds, setAppliedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { addToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchOpportunities = async () => {
      try {
        setLoading(true)
        const data = await apiService.getOpportunities()
        setOpportunities(data)
        // Load applied opportunities from localStorage
        const stored = localStorage.getItem(`appliedOpportunities_${user.id}`)
        if (stored) {
          setAppliedIds(new Set(JSON.parse(stored)))
        }
      } catch (error) {
        addToast('Failed to load opportunities', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunities()
  }, [user, router, addToast])

  const handleApply = async (opportunityId) => {
    try {
      await apiService.applyToOpportunity(opportunityId)
      const newAppliedIds = new Set(appliedIds)
      newAppliedIds.add(opportunityId)
      setAppliedIds(newAppliedIds)
      localStorage.setItem(`appliedOpportunities_${user.id}`, JSON.stringify([...newAppliedIds]))
      addToast('Successfully applied to opportunity!', 'success')
    } catch (error) {
      addToast('Failed to apply to opportunity', 'error')
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <LoadingSpinner fullPage message="Loading your applications..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-2">Your Dashboard</h1>
        <p className="text-secondary mb-8">View all your applications and opportunities</p>

        {opportunities.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-secondary mb-4">No opportunities found yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map(opportunity => (
              <div key={opportunity.id} className="relative">
                <OpportunityCard 
                  opportunity={opportunity} 
                  applied={appliedIds.has(opportunity.id)}
                />
                {!appliedIds.has(opportunity.id) && (
                  <button
                    onClick={() => handleApply(opportunity.id)}
                    className="absolute bottom-6 right-6 bg-success text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
