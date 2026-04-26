'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { apiService } from '@/lib/apiService'
import { Calendar, ArrowLeft, Upload, Link as LinkIcon, CheckCircle, Clock } from 'lucide-react'

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [task, setTask] = useState(null)
  const [opportunity, setOpportunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submission, setSubmission] = useState(null)
  const [submissionType, setSubmissionType] = useState('')
  const [fileData, setFileData] = useState(null)
  const [linkData, setLinkData] = useState('')
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
        const taskData = await apiService.getTaskById(params.id)
        if (!taskData) {
          router.push('/tasks')
          return
        }
        setTask(taskData)
        setSubmissionType(taskData.submissionType)

        const oppData = await apiService.getOpportunityById(taskData.opportunityId)
        setOpportunity(oppData)
      } catch (error) {
        addToast('Failed to load task details', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, user, router, addToast])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileData({
        name: file.name,
        size: file.size,
        type: file.type,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (submissionType === 'file' && !fileData) {
      addToast('Please select a file to upload', 'error')
      return
    }

    if (submissionType === 'link' && !linkData) {
      addToast('Please enter a link', 'error')
      return
    }

    setSubmitting(true)
    try {
      const submissionData = {
        type: submissionType,
        ...(submissionType === 'file' ? { file: fileData } : { link: linkData }),
      }

      const result = await apiService.submitTask(params.id, submissionData)

      if (result.success) {
        setSubmission(result.submission)
        setFileData(null)
        setLinkData('')
        
        // Update task status to in_progress
        await apiService.updateTaskStatus(params.id, 'in_progress')
        setTask({ ...task, status: 'in_progress' })
        
        addToast('Submission received successfully!', 'success')
      }
    } catch (error) {
      addToast('Failed to submit task', 'error')
    } finally {
      setSubmitting(false)
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
          <LoadingSpinner fullPage message="Loading task..." />
        </div>
      </div>
    )
  }

  if (!task) {
    return null
  }

  const statusStyles = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
    in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
    completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
  }

  const status = statusStyles[task.status]
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Link
          href="/tasks"
          className="flex items-center gap-2 text-primary font-medium mb-8 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tasks
        </Link>

        {/* Task Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold text-foreground">{task.title}</h1>
            <span className={`text-sm font-medium px-4 py-2 rounded-full ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>

          {opportunity && (
            <Link href={`/opportunities/${opportunity.id}`} className="text-primary font-medium hover:underline mb-6 block">
              {opportunity.title}
            </Link>
          )}

          <p className="text-secondary text-lg mb-6">{task.description}</p>

          {task.dueDate && (
            <div className={`flex items-center gap-3 mb-8 ${isOverdue && task.status !== 'completed' ? 'text-danger font-medium' : 'text-secondary'}`}>
              <Calendar className="w-5 h-5" />
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              {isOverdue && task.status !== 'completed' && <span className="text-xs">(Overdue)</span>}
            </div>
          )}
        </div>

        {/* Submission Status */}
        {submission && (
          <div className="bg-success bg-opacity-10 border border-success rounded-lg p-8 mb-8">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-bold text-success mb-2">Submission Received</h2>
                <p className="text-secondary mb-2">
                  Your submission was received on {new Date(submission.submittedAt).toLocaleDateString()} at {new Date(submission.submittedAt).toLocaleTimeString()}
                </p>
                {submission.type === 'file' && (
                  <p className="text-secondary">File: {submission.file.name}</p>
                )}
                {submission.type === 'link' && (
                  <p className="text-secondary">
                    Link: <a href={submission.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{submission.link}</a>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submission Form */}
        {task.status !== 'completed' && !submission && (
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Submit Your Work</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Submission Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="submissionType"
                      value="file"
                      checked={submissionType === 'file'}
                      onChange={(e) => {
                        setSubmissionType(e.target.value)
                        setLinkData('')
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-foreground">Upload File</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="submissionType"
                      value="link"
                      checked={submissionType === 'link'}
                      onChange={(e) => {
                        setSubmissionType(e.target.value)
                        setFileData(null)
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-foreground">Submit Link</span>
                  </label>
                </div>
              </div>

              {submissionType === 'file' ? (
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-foreground mb-2">
                    <div className="flex items-center gap-2 mb-4">
                      <Upload className="w-5 h-5" />
                      Choose File
                    </div>
                  </label>
                  <input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {fileData && (
                    <p className="text-sm text-secondary mt-2">
                      Selected: {fileData.name} ({(fileData.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-foreground mb-2">
                    <div className="flex items-center gap-2 mb-4">
                      <LinkIcon className="w-5 h-5" />
                      Submission Link
                    </div>
                  </label>
                  <input
                    id="link"
                    type="url"
                    value={linkData}
                    onChange={(e) => setLinkData(e.target.value)}
                    placeholder="https://example.com/your-submission"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Task'}
              </button>
            </form>
          </div>
        )}

        {task.status === 'completed' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-success mb-2">Task Completed</h2>
            <p className="text-secondary">Great job! You&apos;ve completed this task.</p>
          </div>
        )}
      </div>
    </div>
  )
}
