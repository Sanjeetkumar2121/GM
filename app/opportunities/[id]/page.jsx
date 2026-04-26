'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import TaskCard from '@/components/TaskCard'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { apiService } from '@/lib/apiService'
import { Calendar, MapPin, Award, Clock, ArrowLeft, CheckCircle } from 'lucide-react'

export default function OpportunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [opportunity, setOpportunity] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [applied, setApplied] = useState(false)
  const { user } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const opp = await apiService.getOpportunityById(params.id)
        if (!opp) {
          router.push('/opportunities')
          return
        }
        setOpportunity(opp)

        const oppTasks = await apiService.getTasks({ opportunityId: params.id })
        setTasks(oppTasks)

        // Check if applied
        const stored = localStorage.getItem(`appliedOpportunities_${user.id}`)
        if (stored) {
          const appliedIds = JSON.parse(stored)
          setApplied(appliedIds.includes(params.id))
        }
      } catch (error) {
        addToast('Failed to load opportunity details', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, user, router, addToast])

  const handleApply = async () => {
    try {
      await apiService.applyToOpportunity(params.id)
      setApplied(true)
      const stored = localStorage.getItem(`appliedOpportunities_${user.id}`)
      const appliedIds = stored ? JSON.parse(stored) : []
      appliedIds.push(params.id)
      localStorage.setItem(`appliedOpportunities_${user.id}`, JSON.stringify(appliedIds))
      addToast('Successfully applied to opportunity!', 'success')
    } catch (error) {
      addToast('Failed to apply', 'error')
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await apiService.updateTaskStatus(taskId, newStatus)
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
      addToast('Task updated successfully', 'success')
    } catch (error) {
      addToast('Failed to update task', 'error')
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <LoadingSpinner fullPage message="Loading opportunity..." />
        </div>
      </div>
    )
  }

  if (!opportunity) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Link
          href="/opportunities"
          className="flex items-center gap-2 text-primary font-medium mb-8 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Opportunities
        </Link>

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold text-foreground">{opportunity.title}</h1>
            {applied && (
              <div className="flex items-center gap-2 bg-success bg-opacity-10 text-success px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                Applied
              </div>
            )}
          </div>

          <p className="text-secondary text-lg mb-6">{opportunity.company}</p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 text-secondary">
              <MapPin className="w-5 h-5" />
              <span>{opportunity.location}</span>
            </div>
            <div className="flex items-center gap-3 text-secondary">
              <Calendar className="w-5 h-5" />
              <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3 text-secondary">
              <Clock className="w-5 h-5" />
              <span>Duration: {opportunity.duration}</span>
            </div>
            <div className="flex items-center gap-3 text-secondary">
              <Award className="w-5 h-5" />
              <span>Stipend: {opportunity.stipend}</span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-bold text-foreground">About this opportunity</h2>
            <p className="text-secondary leading-relaxed">{opportunity.fullDescription}</p>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-bold text-foreground">Requirements</h2>
            <div className="flex flex-wrap gap-2">
              {opportunity.requirements.map((req, idx) => (
                <span
                  key={idx}
                  className="bg-muted text-foreground text-sm font-medium px-4 py-2 rounded-full"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>

          {!applied && (
            <button
              onClick={handleApply}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              Apply Now
            </button>
          )}
        </div>

        {/* Tasks */}
        {tasks.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Required Tasks</h2>
            <div className="space-y-4">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
