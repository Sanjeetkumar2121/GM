'use client';

import { useState, useContext } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AuthContext } from '@/contexts/AuthContext';
import { ToastContext } from '@/contexts/ToastContext';
import { apiService } from '@/lib/apiService';
import { useFetch } from '@/hooks/useFetch';

export default function SubmissionsPage() {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const { data: submissions, loading, error, refetch } = useFetch(
    user ? '/api/submissions' : null
  );

  const handleDeleteSubmission = async (submissionId) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      await apiService.delete(`/api/submissions/${submissionId}`);
      showToast('Submission deleted successfully', 'success');
      refetch();
    } catch (err) {
      showToast('Failed to delete submission', 'error');
      console.error('Delete submission error:', err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Sign in Required</h2>
          <p className="text-gray-600 mb-8">Please sign in to view your submissions.</p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-800">My Submissions</h1>
          <p className="text-gray-600 mt-2">Track and manage all your task submissions</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">Failed to load submissions: {error}</p>
          </div>
        )}

        {!submissions || submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No submissions yet</p>
            <p className="text-gray-400 mb-6">Complete a task to create your first submission</p>
            <Link
              href="/tasks"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              View Tasks
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Task #{submission.taskId}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {submission.content}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>Status: <span className="font-semibold text-gray-700">{submission.status}</span></span>
                      <span>Submitted: {new Date(submission.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-lg transition"
                    >
                      <Eye size={18} />
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteSubmission(submission.id)}
                      className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                Submission Details
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Task ID</h3>
                <p className="text-gray-800">{selectedSubmission.taskId}</p>
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Content</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedSubmission.content}</p>
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Status</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedSubmission.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : selectedSubmission.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedSubmission.status}
                </span>
              </div>
              {selectedSubmission.feedback && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Feedback</h3>
                  <p className="text-gray-700">{selectedSubmission.feedback}</p>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
