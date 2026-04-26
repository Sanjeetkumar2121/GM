'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import TaskCard from '@/components/TaskCard'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { apiService } from '@/lib/apiService'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react'

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const { user } = useAuth()
  const { addToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchTasks = async () => {
      try {
        setLoading(true)
        const data = await apiService.getTasks()
        setTasks(data)
        setFilteredTasks(data)
      } catch (error) {
        addToast('Failed to load tasks', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [user, router, addToast])

  useEffect(() => {
    let filtered = tasks

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter)
    }

    setFilteredTasks(filtered)
  }, [statusFilter, tasks])

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <LoadingSpinner fullPage message="Loading your tasks..." />
        </div>
      </div>
    )
  }

  const pendingCount = tasks.filter(t => t.status === 'pending').length
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length
  const completedCount = tasks.filter(t => t.status === 'completed').length

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-2">Your Tasks</h1>
        <p className="text-secondary mb-8">Track and manage all your application tasks</p>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm font-medium">Total Tasks</p>
                <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
              </div>
              <Circle className="w-8 h-8 text-secondary" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
              </div>
              <Circle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-foreground">{inProgressCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-foreground">{completedCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-secondary text-sm font-medium">Filter by status:</span>
            {['all', 'pending', 'in_progress', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-primary text-white'
                    : 'bg-muted text-foreground hover:bg-opacity-80'
                }`}
              >
                {status === 'all' ? 'All' : status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-secondary mb-4">No tasks found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
