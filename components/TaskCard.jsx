'use client'

import Link from 'next/link'
import { CheckCircle2, Circle, Calendar, AlertCircle } from 'lucide-react'

export default function TaskCard({ task, onStatusChange }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()
  const isCompleted = task.status === 'completed'

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <button
          onClick={() => onStatusChange?.(task.id, isCompleted ? 'pending' : 'completed')}
          className="mt-1 flex-shrink-0 hover:opacity-80 transition-opacity"
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-success" />
          ) : (
            <Circle className="w-6 h-6 text-secondary" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link
              href={`/tasks/${task.id}`}
              className={`text-lg font-bold hover:text-primary transition-colors ${isCompleted ? 'line-through text-secondary' : 'text-foreground'}`}
            >
              {task.title}
            </Link>
            <span className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${statusStyles[task.status]}`}>
              {task.status === 'in_progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
          </div>

          <p className="text-secondary text-sm mb-3 line-clamp-2">{task.description}</p>

          {task.dueDate && (
            <div className={`flex items-center gap-2 text-sm ${isOverdue && !isCompleted ? 'text-danger font-medium' : 'text-secondary'}`}>
              <Calendar className="w-4 h-4" />
              Due: {new Date(task.dueDate).toLocaleDateString()}
              {isOverdue && !isCompleted && (
                <AlertCircle className="w-4 h-4" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
